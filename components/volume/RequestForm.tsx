import React from 'react';
import { connect } from 'react-redux'
import VolumeForm from './VolumeForm';
import { FIELD_TYPES } from './IVolume';
import { updateRmvFieldValue, resetRmvValue } from '../../redux/actions/volumeActions';

const RequestForm = (props: any) => {
  const { dataSet, rmvField, updateRmvFieldValue, resetRmvFieldValue } = props;

  const validateRmvControl = () : any => {
    let isValid = true;
    let breakLoop = false;
    let message = null;

    rmvField.Controls.forEach((fieldArray: any) => {
      if (breakLoop) return;

      fieldArray.forEach((field: any) => {
        if (breakLoop) return;

        switch (field.FieldType) {
          case FIELD_TYPES.DROPDOWN: {
            if(!field.IsRequired) return;

            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Select the value for " + field.ColumnDisplayTitle;
            }

            return isValid;
          }
          case FIELD_TYPES.DROPDOWN_MULTI: {
            if(!field.IsRequired) return;

            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Select the value for " + field.ColumnDisplayTitle;
            }

            return isValid;
          }
          case FIELD_TYPES.NUMBER: {
            if(!field.IsRequired) return;
            
            if (field.FieldValue === null) {
              isValid = false;
              breakLoop = true;
              message = "Enter the value for " + field.ColumnDisplayTitle;
            }

            return isValid;
          }
        }
      })
    })

    const requestTypesValue = [];
    let isRequestTypesDuplicae = false;
    rmvField.Controls.forEach((fieldArray: any) => {
      fieldArray.forEach((field: any) => {
        switch (field.FieldType) {
          case FIELD_TYPES.DROPDOWN: {
            if (field.ColumnName === "RequestType") {
              if (field.FieldValue !== null) {
                const value = field.FieldValue.ID;
                if (requestTypesValue.indexOf(value) !== -1) {
                  requestTypesValue.push(value)
                  isRequestTypesDuplicae = true;
                } else {
                  requestTypesValue.push(value)
                }
              }
            }
          }
        }
      })
    })

    return {
      isValid,
      message,
      isRequestTypesDuplicae
    };

    return isValid;
  }

  const getRmvControlFieldValue = () : any[] => {
    const fieldValues = [];
    rmvField.Controls.forEach((fieldArray: any, index: number) => {
      const fields = []
      fieldArray.forEach((field: any) => {
        const _field = {
          ColumnName: field.ColumnName,
          FieldType: field.FieldType,
          DataSavedList: field.DataSavedList,
          FieldValue: field.FieldValue
        }

        fields.push(_field);
      })

      fieldValues.push(fields);
    })

    return fieldValues;
  }

  const submitForm = () => {
    const result = validateRmvControl();

    if(result.isRequestTypesDuplicae) {
      alert("Duplicate Request Type are not allowed.");
      return;
    }

    if(result.isValid) {
      const rmvFieldValues = getRmvControlFieldValue();
      updateRmvFieldValue({
        rmvField : rmvField,
        value: rmvFieldValues
      })
      console.log(rmvField)
      console.log("PASSED TO API", rmvFieldValues);
    }
    else {
      alert(result.message)
    }
  }

  const resetForm = () => {
    resetRmvFieldValue();
  }

  const content = (
    <div>
      <button type="button" className="btn btn-outline-primary btn-sm" onClick={submitForm}>Save Form</button>
      <button type="button" className="btn btn-outline-primary btn-sm ml-1" onClick={resetForm}>Reset Form</button>
      <VolumeForm />
    </div>
  )

  return content;
}

const mapStateToProps = (state) => ({
  dataSet: state.volume.RequestForm.DropdownData,
  rmvField: state.volume.RequestForm.Fields.filter(x => x.FieldType === "RMVControl")[0],
})

const mapDispachToProps = (dispatch) => ({ 
  updateRmvFieldValue : (payload: any) => dispatch(updateRmvFieldValue(payload)),
  resetRmvFieldValue : () => dispatch(resetRmvValue())
})

export default connect(mapStateToProps, mapDispachToProps)(RequestForm);