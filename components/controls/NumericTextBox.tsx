import React from 'react';
import { NumericTextBox } from '@progress/kendo-react-inputs';

const RSNumericTextBox = (props: any) => {
  const {
    valueFormat,
    className,
    fieldName,
    maxValue,
    minValue,
    fieldValue,
    placeholder,
    isRequired,
    validationMessage,
    onChange
  } = props;

  return (
    <div className='form--control'>
      <NumericTextBox
        format={valueFormat !== undefined ? valueFormat : 'n'}
        className={className}
        name={fieldName}
        max={maxValue}
        min={minValue}
        spinners={false}
        defaultValue={fieldValue}
        value={fieldValue}
        placeholder={placeholder}
        required={isRequired}
        validationMessage={validationMessage}
        onChange={onChange}
      />
    </div>
  );
};

export default RSNumericTextBox;
