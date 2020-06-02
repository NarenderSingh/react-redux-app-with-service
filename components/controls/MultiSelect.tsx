import React from 'react';
import { MultiSelect } from '@progress/kendo-react-dropdowns';

const RSMultiSelect = (props: any) => {
  const {
    fieldName,
    data,
    fieldValue,
    textField,
    dataItemKey,
    onChange,
    isRequired,
    placeholder,
    validationMessage
  } = props;

  return (
    <div className='form--control'>
      <MultiSelect
        name={fieldName}
        data={data}
        onChange={onChange}
        value={fieldValue}
        textField={textField}
        dataItemKey={dataItemKey}
        filterable={true}
        required={isRequired}
        placeholder={placeholder}
        validationMessage={validationMessage}
      />
    </div>
  );
};

export default RSMultiSelect;
