import { Fileinput } from '@nayeshdaggula/tailify'
import { X } from 'lucide-react'
import React from 'react'

function AgreementtemplateModal({ closeAgreementTemplateModal, agreementTemplateFile, agreementTemplateFileError, updateAgreementTemplateFile, uploadAgreementTemplate }) {
    return (
        <div>
            <div className="flex items-center justify-between py-3 border-b px-5 mb-3">
                <p className="font-semibold text-lg text-[#0083bf]">Upload agreement template</p>
                <X className="x-11 cursor-pointer text-[#0083bf] hover:text-[#00628f]/50" onClick={closeAgreementTemplateModal} />
            </div>
            <div className="px-5 mb-3 text-sm text-black">
                <p className="font-medium">Guidelines:</p>
                <p className="mt-1">
                    The placeholders should be wrapped inside <code>&lt;&lt; &gt;&gt;</code> tags, e.g.{" "}
                    <code>&lt;&lt;FLAT_NAME&gt;&gt;</code>.
                </p>
                <p className="mt-1">
                    Available placeholders:{" "}
                    <span className="block mt-1 text-black">
                        DATE, NUM_KEY, NAME, GUARDIAN_NAME, AGE, OCCUPATION, AADHAAR_NUMBER,
                        PAN_NUMBER, ADDRESS, PROJECT_NAME, FLAT_NO, FLOOR_NO, BLOCK_NO, SFT,
                        CAR_PARKING, UDS, SALE_VALUE, RCPT_NUM, RCPT_VALUE, RCPT_TYPE, RCPT_DATE,
                        NORTH, SOUTH, EAST, WEST
                    </span>
                </p>
            </div>
            <Fileinput
                placeholder="Click here to select a file"
                accept=".docx"
                error={agreementTemplateFileError}
                value={agreementTemplateFile}
                onChange={updateAgreementTemplateFile}
                mainContainerClass="!px-5"
            />
            <div className="w-full justify-end flex border-t py-3 px-5 mt-3">
                <button
                    disabled={!agreementTemplateFile}
                    onClick={uploadAgreementTemplate}
                    className={`px-3 py-2 bg-[#0083bf] text-white rounded-md hover:bg-[#00628f] ${!agreementTemplateFile ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                    Upload
                </button>
            </div>
        </div>
    )
}

export default AgreementtemplateModal