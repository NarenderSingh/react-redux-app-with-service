import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Notification, NotificationGroup } from '@progress/kendo-react-notification';
import { addNewRow, inputChange, deleteRmvRow, fillRmvFieldData } from '../../redux/actions/volumeActions';
import { FIELD_TYPES } from './IVolume';
import RSDropDown from '../controls/DropDown';
import RSMultiSelect from '../controls/MultiSelect';
import RSNumericTextBox from '../controls/NumericTextBox';

const initialRmvFields = [];

const VolumeForm = (props: any) => {
  const { rmvField, addNewRow, dispatchInputChange, dispatchDelete, volume, dataSet, fillRmvFieldData } = props;

  if (!rmvField.hasOwnProperty("Controls"))
    return null;

  if (initialRmvFields.length === 0)
    initialRmvFields.push(JSON.parse(JSON.stringify(rmvField.Controls[0])));

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteRowIndex, setDeleteRowIndex] = useState(0);
  const [successMessage, setSuccessMessage] = useState({ visible: false, message: null });
  const [errorMessage, setErrorMessage] = useState({ visible: false, message: null });

  useEffect(() => {
    fillRmvFieldData();
  }, [])
  // console.log("DATASET", dataSet);

  const headers = rmvField.Controls[0];
  const controls = rmvField.Controls;

  const inputChange = (e: any, field: any, rowIndex: number) => {
    dispatchInputChange({
      rmvField: rmvField, field: field,
      rowIndex: rowIndex,
      value: e.value
    });
  };

  const validateNewRow = (): any => {
    let isValid = true;
    let breakLoop = false;
    let message = null;

    rmvField.Controls.forEach((fieldCollection: any) => {
      if (breakLoop) return;

      fieldCollection.forEach((field: any) => {
        if (breakLoop) return;

        switch (field.FieldType) {
          case FIELD_TYPES.DROPDOWN: {
            if (!field.IsRequired) {
              return
            }

            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Select the value for " + field.ColumnDisplayTitle;
              break;
            }
          }
          case FIELD_TYPES.DROPDOWN_MULTI: {
            if (!field.IsRequired) {
              return
            }

            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Select the value for " + field.ColumnDisplayTitle;
              break;
            }
          }
          case FIELD_TYPES.NUMBER: {
            if (!field.IsRequired) {
              return
            }

            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Enter the value for " + field.ColumnDisplayTitle;
              break;
            }
          }
        }
      })
    })

    return {
      isValid,
      message
    };
  }

  const removeSelectedValue = () => {
    const selectedRequestTypes = [];
    rmvField.Controls.forEach((fieldArray: any) => {
      fieldArray.forEach((field: any) => {
        if (field.ColumnName === "RequestType")
          selectedRequestTypes.push(field.FieldValue);
      })
    });

    let isMaxLimitOver = false;
    let newRow = JSON.parse(JSON.stringify(initialRmvFields[0]))

    let newData = []
    newRow.forEach((field: any) => {
      if (field.ColumnName === "RequestType") {
        const data = field.Data; // 4 values

        for (var i = 0; i < selectedRequestTypes.length; i++) {
          for (var j = 0; j < data.length; j++) {
            if (selectedRequestTypes[i].Title === data[j].Title) {
              data.splice(j, 1);
            }
          }
        }

        if (data.length === 0) {
          isMaxLimitOver = true;
        }
        if (data.length === 1) {
          field.FieldValue = data[0];
        }
        field.Data = data;
      }
    })

    newRow = JSON.parse(JSON.stringify(newRow))

    return {
      newRow,
      isMaxLimitOver
    };
  }

  const onAddRow = () => {
    if (!validateNewRow().isValid) {
      const message = validateNewRow().message;
      setErrorMessage({ visible: true, message: message });
      setTimeout(() => {
        setErrorMessage({ visible: false, message: null });
      }, 2500)
      return;
    }

    //---------------------------
    // const result = removeSelectedValue()
    // const newRow = result.newRow
    // const isMaxLimitOver = result.isMaxLimitOver;

    // if (isMaxLimitOver) {
    //   setErrorMessage({ visible: true, message: "Max limit over" });
    //   setTimeout(() => {
    //     setErrorMessage({ visible: false, message: null });
    //   }, 2500)
    //   return;
    // }
    //---------------------------

    let newRow = JSON.parse(JSON.stringify(initialRmvFields[0]))
    addNewRow({ field: rmvField, newRow: newRow });
  };

  const getDropDownData = (field: any): any => {
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
                if(parentKeyName === parentFieldValue.KeyName.toLowerCase()) {
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

  const renderField = (field: any, rowIndex: number) => {
    switch (field.FieldType) {
      case FIELD_TYPES.DROPDOWN: {
        // const data = getDropDownData(field).dropdownData;

        const _field: any = {
          fieldName: field.ColumnName,
          // data: data,
          data: field.Data,
          placeholder: field.PlaceholderText,
          isRequired: field.IsRequired,
          validationMessage: field.ValidationMessage,
          textField: field.DataItemText,
          dataItemKey: field.DataItemKey,
          fieldValue: field.FieldValue,
          onChange: (e: any) => inputChange(e, field, rowIndex)
        };

        return <RSDropDown {..._field} />;
      }
      case FIELD_TYPES.DROPDOWN_MULTI: {
        // const data = getDropDownData(field).dropdownData;
        // const fieldValue = getDropDownData(field).fieldValue;

        const _field: any = {
          fieldName: field.ColumnName,
          // data: data,
          data: field.Data,
          placeholder: field.PlaceholderText,
          isRequired: field.IsRequired,
          validationMessage: field.ValidationMessage,
          textField: field.DataItemText,
          dataItemKey: field.DataItemKey,
          fieldValue: field.FieldValue,
          onChange: (e: any) => inputChange(e, field, rowIndex)
        };

        return <RSMultiSelect {..._field} />;
      }
      case FIELD_TYPES.NUMBER: {
        const _field: any = {
          fieldName: field.ColumnName,
          placeholder: field.PlaceholderText,
          isRequired: field.IsRequired,
          validationMessage: field.ValidationMessage,
          fieldValue: field.FieldValue,
          onChange: (e: any) => inputChange(e, field, rowIndex)
        };

        return <RSNumericTextBox {..._field} />;
      }
      default: {
        return null;
      }
    }
  };

  const showDeleteDialog = (rowIndex: number = 0) => {
    setDeleteModal(true);
    setDeleteRowIndex(rowIndex);
  }

  const hideDeleteDialog = () => {
    setDeleteModal(false);
  }

  const confirmRmvDelete = () => {
    dispatchDelete({
      rmvField: rmvField,
      rowIndex: deleteRowIndex
    })

    window.setTimeout(() => {
      hideDeleteDialog();
      setSuccessMessage({ visible: true, message: "Volume details removed." });
      setTimeout(() => {
        setSuccessMessage({ visible: false, message: null });
      }, 2500)
    }, 100);
  }

  const content = (
    <div className='row'>
    <div className='col-sm-12 mt-10 mb-20'> 
              <button
            type='button'
            className='btn btn-outline-primary btn-sm float-right mb-1'
            onClick={onAddRow}>
            Add Row
        </button>
    </div>
      <div className='col-sm-12'>     
        <div className={(rmvField.IsRequired && !rmvField.IsFieldValid) ? "form-error" : "" }>
          <table className='table table-bordered'>
            <thead className='text-center'>
              <tr>
                {headers.map((field: any, key: number) => {
                  return (
                    // style={{ width: '33%' }}
                    <td key={key}>
                      {field.ColumnName}
                    </td>
                  );
                })}
                <td style={{ width: '50px' }}>
                  Delete
              </td>
              </tr>
            </thead>
            <tbody>
              {controls.map((fields: any, rowIndex: number) => {
                return (
                  <tr key={rowIndex}>
                    {fields.map((field: any, cellIndex: number) => {
                      return (
                        // style={{ width: '33%' }}
                        <td key={cellIndex}>
                          {renderField(field, rowIndex)}
                        </td>
                      );
                    })}
                    <td style={{ width: '50px' }}>
                      {
                        rowIndex === 0 ? "-" : <i className="fa fa-times"
                          onClick={() => showDeleteDialog(rowIndex)}></i>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {
          deleteModal && (
            <Dialog title={"Please confirm"} onClose={hideDeleteDialog}>
              <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to remove the volume details?</p>
              <DialogActionsBar>
                <button type="button" className="k-button" onClick={hideDeleteDialog}>No</button>
                <button type="button" className="k-button" onClick={confirmRmvDelete}>Yes</button>
              </DialogActionsBar>
            </Dialog>
          )
        }

        <NotificationGroup
          style={{
            right: 0,
            top: 0,
            alignItems: 'flex-start',
            flexWrap: 'wrap-reverse'
          }}>

          {successMessage.visible && (
            <Notification
              type={{ style: 'success', icon: true }}
              hideAfter={3000}
              closable={true}
              onClose={() => setSuccessMessage({ visible: false, message: null })}
            >
              {
                successMessage.message
              }
            </Notification>)}
          {errorMessage.visible && (
            <Notification
              type={{ style: 'error', icon: true }}
              hideAfter={3000}
              closable={true}
              onClose={() => setErrorMessage({ visible: false, message: null })}
            >
              {
                errorMessage.message
              }
            </Notification>)}
        </NotificationGroup>
      </div>
    </div>
  );

  return content;
}

const mapStateToProps = (state) => ({
  volume: state.volume,
  rmvField: state.volume.RequestForm.Fields.filter(x => x.FieldType === "RMVControl")[0],
  dataSet: state.volume.RequestForm.DropdownData
})

const mapDispachToProps = (dispatch) => ({
  addNewRow: (payload) => dispatch(addNewRow(payload)),
  dispatchInputChange: (payload) => dispatch(inputChange(payload)),
  dispatchDelete: (payload) => dispatch(deleteRmvRow(payload)),
  fillRmvFieldData: () => dispatch(fillRmvFieldData())
})

export default connect(mapStateToProps, mapDispachToProps)(VolumeForm);
