export const RMV_ADD_ROW = 'RMV_ADD_ROW';
export const RMV_INPUT_CHANGE = 'RMV_INPUT_CHANGE';
export const RMV_DELETE_ROW = 'RMV_DELETE_ROW';
export const RMV_UPDATE_FIELD_VALUE = 'RMV_UPDATE_FIELD_VALUE';
export const RMV_RESET_FIELD = 'RMV_RESET_FIELD';
export const FILL_RMV_FIELD_DATA = 'FILL_RMV_FIELD_DATA';
export const RMV_UPDATE_CHILD_FIELD = 'RMV_UPDATE_CHILD_FIELD';

export const addNewRow = (payload: any) => ({
  type: RMV_ADD_ROW,
  payload: {
    newRow: payload.newRow,
    field: payload.field
  }
});

export const inputChange = (payload: any) => ({
  type: RMV_INPUT_CHANGE,
  payload: {
    rmvField: payload.rmvField,
    field: payload.field,
    rowIndex: payload.rowIndex,
    value: payload.value
  }
});

export const deleteRmvRow = (payload: any) => ({
  type: RMV_DELETE_ROW,
  payload: {
    rmvField: payload.rmvField,
    rowIndex: payload.rowIndex
  }
});

export const updateRmvFieldValue = (payload: any) => ({
  type: RMV_UPDATE_FIELD_VALUE,
  payload: {
    rmvField: payload.rmvField,
    value: payload.value
  }
});

export const resetRmvValue = () => ({
  type: RMV_RESET_FIELD
});

export const fillRmvFieldData = () => ({
  type: FILL_RMV_FIELD_DATA
});

export const updateRmvChildField = (payload: any) => ({
  type: RMV_UPDATE_CHILD_FIELD,
  payload: {
    childField: payload.childField,
    rowIndex: payload.rowIndex
  }
});

