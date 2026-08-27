package com.wisepick.sales.dto;

import java.util.ArrayList;
import java.util.List;

public class SaleImportResponse {

    private int totalRows;

    private int importedRows;

    private int failedRows;

    private List<String> errors =
            new ArrayList<>();


    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(
            int totalRows
    ) {
        this.totalRows = totalRows;
    }


    public int getImportedRows() {
        return importedRows;
    }

    public void setImportedRows(
            int importedRows
    ) {
        this.importedRows = importedRows;
    }


    public int getFailedRows() {
        return failedRows;
    }

    public void setFailedRows(
            int failedRows
    ) {
        this.failedRows = failedRows;
    }


    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(
            List<String> errors
    ) {
        this.errors = errors;
    }

}
