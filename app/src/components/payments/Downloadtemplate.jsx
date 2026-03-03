import React from 'react';
import ExcelPaymentTemplate from "../shared/ExcelPaymentTemplate";

function Downloadtemplate({ closeDownloadTemplate }) {
    return (
        <ExcelPaymentTemplate closeDownloadTemplate={closeDownloadTemplate} />
    );
}

export default Downloadtemplate;
