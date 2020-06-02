
import { initialState } from '../states/volumeState';
import { RMV_ADD_ROW, RMV_INPUT_CHANGE, RMV_DELETE_ROW, RMV_UPDATE_FIELD_VALUE, RMV_RESET_FIELD } from '../actions/volumeActions';
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
                }

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
    case RMV_RESET_FIELD : {
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

      console.log("state", state.RequestForm.Fields.filter(x=>x.ColumnName === "RMVControl")[0]);
      return state;
    }
    default:
      return state;
  }
};