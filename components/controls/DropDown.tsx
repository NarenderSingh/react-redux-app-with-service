import React from 'react';
import { ComboBox } from '@progress/kendo-react-dropdowns';

const RSDropDown = (props: any) => {
  const {
    fieldName,
    data,
    fieldValue,
    textField,
    placeholder,
    dataItemKey,
    onChange,
    isRequired,
    validationMessage,
    className,
    filterable,
    filterChange
  } = props;

  return (
    <div className='form--control'>
      <ComboBox
        name={fieldName}
        data={data}
        value={fieldValue}
        textField={textField}
        placeholder={placeholder}
        dataItemKey={dataItemKey}
        onChange={onChange}
        required={isRequired}
        validationMessage={validationMessage}
        className={className}
        filterable={filterable}
        onFilterChange={filterChange}
      />
    </div>
  );
};

export default RSDropDown;
