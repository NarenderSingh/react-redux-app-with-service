
import { initialState } from '../states/volumeState';
import { RMV_ADD_ROW, RMV_INPUT_CHANGE, RMV_DELETE_ROW, RMV_UPDATE_FIELD_VALUE, RMV_RESET_FIELD, FILL_RMV_FIELD_DATA, RMV_UPDATE_CHILD_FIELD } from '../actions/volumeActions';
import { FIELD_TYPES } from '../../components/volume/IVolume';
import * as _ from 'lodash';

export const volumeReducer = (state = initialState, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case RMV_ADD_ROW: {
      const { newRow, field } = payload;
      const _field = field;

      return {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field: any) => {
            if (field.ColumnName === _field.ColumnName) {
              const controls = field.Controls;
              controls.push(newRow);

              return {
                ...field,
                Controls: controls
              };
            }
            return field;
          })
        }
      };
    }
    case RMV_INPUT_CHANGE: {
      const { rmvField, field, value, rowIndex } = payload;
      const _field = field;
      const dataSet = state.RequestForm.DropdownData;

      return {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === rmvField.ColumnName) {
              const _rmvFields = field.Controls[rowIndex];

              _rmvFields.map((childField: any) => {
                if (childField.ColumnName === _field.ColumnName) {
                  childField.FieldValue = value;

                  if(childField.FieldType === "DropDown") {
                    const cascadingField = cascadingData(dataSet, _rmvFields, childField, value, rowIndex)
                    if(cascadingField !== null) {
                      console.log("cascading filed", cascadingField)
                    }
                  }
                }

                // flip / flop rmv control validation
                if (rowIndex === 0) {
                  if (childField.ColumnName === "RequestType") {
                    if (childField.FieldValue !== null) {
                      field.IsFieldValid = true
                    }
                    else {
                      field.IsFieldValid = false;
                    }
                  }
                }
              });
            }
            return field;
          })
        }
      };
    }
    case RMV_DELETE_ROW: {
      const { rmvField, rowIndex } = payload;

      return {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === rmvField.ColumnName) {
              const items = rmvField.Controls;
              const filteredItems = items.slice(0, rowIndex).concat(items.slice(rowIndex + 1, items.length))

              field.Controls = filteredItems;
            }
            return field;
          })
        }
      };
    }
    case RMV_UPDATE_FIELD_VALUE: {
      const { rmvField, value } = payload;

      return {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === rmvField.ColumnName) {
              field.FieldValue = value;
            }
            return field;
          })
        }
      };
    }
    case RMV_RESET_FIELD: {
      state = {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === "RMVControl") {
              field.FieldValue = null;
              field.IsFieldValid = false;

              if (field.hasOwnProperty("Controls")) {
                const initialRmvFields = field.Controls[0];
                field.Controls = [];
                field.Controls.push(initialRmvFields);

                initialRmvFields.forEach((childField: any) => {
                  const fieldType = childField.FieldType;

                  switch (fieldType) {
                    case FIELD_TYPES.DROPDOWN: {
                      childField.Data = [];
                      childField.FieldValue = null;
                      childField.IsFieldValid = false;
                    }
                    case FIELD_TYPES.DROPDOWN_MULTI: {
                      childField.Data = [];
                      childField.FieldValue = null;
                      childField.IsFieldValid = false;
                    }
                    case FIELD_TYPES.NUMBER: {
                      childField.FieldValue = null;
                      childField.IsFieldValid = false;
                    }
                  }
                })
              }
            }
            return field;
          })
        }
      };

      console.log("state", state.RequestForm.Fields.filter(x => x.ColumnName === "RMVControl")[0]);
      return state;
    }
    case FILL_RMV_FIELD_DATA: {
      const dataSet = state.RequestForm.DropdownData;

      state = {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === "RMVControl") {
              if (field.hasOwnProperty("Controls")) {
                field.Controls.forEach((fieldArray: any[]) => {
                  fieldArray.forEach((childField: any) => {
                    const fieldType = childField.FieldType;

                    switch (fieldType) {
                      case FIELD_TYPES.DROPDOWN: {
                        const data = getDropDownData(dataSet, field, childField).dropdownData;

                        childField.Data = data;
                        childField.FieldValue = null;
                        childField.IsFieldValid = false;
                        return childField;
                      }
                      case FIELD_TYPES.DROPDOWN_MULTI: {
                        const data = getDropDownData(dataSet, field, childField).dropdownData;

                        childField.Data = [];
                        childField.FieldValue = null;
                        childField.IsFieldValid = false;
                        return childField;
                      }
                      case FIELD_TYPES.NUMBER: {
                        childField.FieldValue = null;
                        childField.IsFieldValid = false;
                        return childField;
                      }
                      default: {
                        return childField;
                      }
                    }
                  })
                })
              }
            }

            return field;
          })
        }
      }

      // console.log(state.RequestForm.Fields.filter(x=>x.FieldType === "RMVControl")[0])
      return state;
    }
    case RMV_UPDATE_CHILD_FIELD: {
      const {rmvField, childField, rowIndex } = payload;

      return {
        ...state,
        RequestForm: {
          ...state.RequestForm,
          Fields: state.RequestForm.Fields.map((field) => {
            if (field.ColumnName === rmvField.ColumnName) {
              
            }
            return field;
          })
        }
      };
    }
    default:
      return state;
  }
};

const cascadingData = (dataSet: any, rmvField: any, field: any, value: any, rowIndex: number): any => {
  let _childField = null;
  if (field.ChildColumnName !== "") {
    const childColumnName = field.ChildColumnName.toLowerCase();

    rmvField.forEach((fld: any) => {
      if (fld.ColumnName.toLowerCase() === childColumnName) {
        fld.Data = [],
        fld.IsFieldValid = false;

        _childField = {
          ...fld,
          Data: [
            {
              "Title": "Software",
              "ID": 3,
              "KeyName": "Software",
              "ParentKeyName": "IT",
              "ColumnName": "RequestSubType",
              "ParentColumnName": "RequestType",
              "ModuleName": {
                "ID": 1,
                "Title": "Request"
              },
              "IsActive": true
            }
          ],
          IsFieldValid: false
        };
      }
    })
  }

  return _childField;
}

const getDropDownData = (dataSet: any, rmvField: any, field: any): any => {
  let dropdownData = [];
  let fieldValue = field.FieldValue;

  if (field.Data.length === 0 && field.ParentColumnName == "") {
    dataSet.MasterData.forEach(data => {
      if (data.ListName.toLowerCase() === field.ColumnName.toLowerCase()) {
        dropdownData = data.Values;
        return;
      }
    })
  }
  else if (field.ParentColumnName !== "") {
    // console.log("Cascading Field", field.ColumnName)
    const parentColumnName = field.ParentColumnName.toLowerCase();
    let _field = field;

    // iterate field to get parent field value
    rmvField.Controls.forEach((fieldArray: any) => {
      fieldArray.forEach((parentField: any) => {
        if (parentField.ColumnName.toLowerCase() === parentColumnName) {
          const parentFieldValue = parentField.FieldValue;
          // console.log("Parent Field Value", parentField.FieldValue)

          if (parentFieldValue === null) {
            dropdownData = [];
            fieldValue = null;
            return;
          }

          // iterate dataset to get value matching with parent value
          dropdownData = [];
          fieldValue = null;
          dataSet.CascadingData.forEach((data: any) => {
            if (data.ColumnName.toLowerCase() === _field.ColumnName.toLowerCase() &&
              data.ParentColumnName.toLowerCase() === parentColumnName) {

              // console.log("MATCHED", data);
              const parentKeyName = data.ParentKeyName.toLowerCase();
              if (parentKeyName === parentFieldValue.KeyName.toLowerCase()) {
                //console.log("EXACT MATCHED", data);
                dropdownData.push(data);
              }
            }
          })
        }
      })
    });
  }

  return {
    dropdownData,
    fieldValue
  };
}
