import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Customerapi from "../../api/Customerapi";
import Errorpanel from "../../shared/Errorpanel";
import noImageStaticImage from "../../../../public/assets/imageplaceholder.png";
import dayjs from "dayjs";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import Overviewtab from "./Overviewtab";

function Flatinfo({ customerUuid, refreshTrigger }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const permissions = useEmployeeDetails((state) => state.permissions);

    const [customerFlatsData, setCustomerFlatsData] = useState({});
    const [paymentSummary, setPaymentSummary] = useState({});

    async function getCustomerFlatsData(customerUuid) {
        if (customerUuid === null) {
            setErrorMessage({
                message: "Customer ID is missing",
                server_res: null,
            });
            setIsLoadingEffect(false);
            return false;
        }

        setIsLoadingEffect(true);
        await Customerapi.get("get-customers-flats", {
            params: {
                customer_uuid: customerUuid,
            },
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                const data = response?.data;
                if (data.status === "error") {
                    const finalresponse = {
                        message: data.message,
                        server_res: data,
                    };
                    setErrorMessage(finalresponse);
                    setIsLoadingEffect(false);
                    return false;
                }

                console.log("data____:", data)
                if (data !== null) {
                    setCustomerFlatsData(data?.data || {});
                    setPaymentSummary(data?.data.map((ele) => ele.paymentSummary) || {});
                }
                setIsLoadingEffect(false);
                return false;
            })
            .catch((error) => {
                console.log("Fetch customer error:", error);
                let finalresponse;
                if (error.response !== undefined) {
                    finalresponse = {
                        message: error.message,
                        server_res: error.response.data,
                    };
                } else {
                    finalresponse = {
                        message: error.message,
                        server_res: null,
                    };
                }
                setErrorMessage(finalresponse);
                setIsLoadingEffect(false);
                return false;
            });
    }

    console.log("pay:", paymentSummary)

    useEffect(() => {
        setIsLoadingEffect(true);
        if (customerUuid) getCustomerFlatsData(customerUuid);
    }, [customerUuid, refreshTrigger]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        })
            .format(price)
            .replace(".00", "");
    };

    const Info = ({ label, value, badge }) => (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            {badge ? (
                <span
                    className={`text-xs font-medium py-0.5 px-2 rounded ${value === "Sold"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                >
                    {value || "-"}
                </span>
            ) : (
                <p className="text-sm font-medium text-gray-900 break-all">{value || "-"}</p>
            )}
        </div>
    );

    const InfoBig = ({ label, value }) => (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-900">{value || "-"}</p>
        </div>
    );

    console.log("flats___:", customerFlatsData)

    return (
        <>
            <div className="flex flex-col gap-4">
                {customerFlatsData?.length > 0 ? (
                    customerFlatsData.map((ele, index) => {
                        const flats = ele?.flat_details;
                        return (
                            <div className="flex flex-col gap-3 w-full border border-gray-200 rounded-lg p-3 shadow-sm bg-white">

                                {/* Header */}
                                <div className="flex justify-between items-center">
                                    {permissions?.flats_page?.includes("view_flat") ? (
                                        <Link to={`/flats/view-flat/${flats?.uuid}`}>
                                            <h2 className="text-base font-semibold text-gray-800 hover:text-[#0083bf]">
                                                <span className="text-indigo-600">{flats?.project_name}</span> - Flat No: {flats?.flat_no || "-"}
                                            </h2>
                                        </Link>
                                    ) : (
                                        <h2 className="text-base font-semibold text-gray-800">
                                            <span className="text-indigo-600">{flats?.project_name}</span> - Flat No: {flats?.flat_no || "-"}
                                        </h2>
                                    )}
                                    <h2 className="text-sm font-medium text-gray-600">{flats?.block || "-"}</h2>
                                </div>

                                {/* Flat image + details */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    {permissions?.flats_page?.includes("view_flat") ? (
                                        <Link to={`/flats/view-flat/${flats?.uuid}`} className="md:w-1/4">
                                            <img
                                                crossOrigin="anonymous"
                                                src={flats?.flat_img_url || noImageStaticImage}
                                                alt="Flat"
                                                className="w-full h-[150px] object-cover rounded-md border border-[#ebecef]"
                                            />
                                        </Link>
                                    ) : (
                                        <div className="md:w-1/4">
                                            <img
                                                crossOrigin="anonymous"
                                                src={flats?.flat_img_url || noImageStaticImage}
                                                alt="Flat"
                                                className="w-full h-[150px] object-cover rounded-md border border-[#ebecef]"
                                            />
                                        </div>
                                    )}

                                    <div className="w-full md:w-3/4 grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                                        <Info label="Floor No" value={flats?.floor_no} />
                                        <Info label="Area (Sq.ft.)" value={flats?.square_feet} />
                                        <Info label="Type" value={flats?.type} />
                                        <Info label="Facing" value={flats?.facing} />
                                        <Info label="Corner" value={flats?.corner ? "Yes" : "No"} />
                                    </div>
                                </div>

                                {/* Cost Details & Financial Summary Table */}
                                <div className="mt-4 border-t border-[#ebecef] pt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Cost Details</h3>
                                    <Overviewtab customerFlatDetails={ele} paymentSummary={paymentSummary} />
                                </div>

                                {/* Payment History */}
                                <div className="mt-3 pt-3 border-t border-[#ebecef]">
                                    <details className="group">
                                        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-gray-600 hover:text-[#0083bf]">
                                            <span>View Payment History</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                            </span>
                                        </summary>
                                        <div className="mt-3">
                                            {flats?.payment_history?.length > 0 ? (
                                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                                            <tr>
                                                                <th className="px-4 py-2 font-medium">Date</th>
                                                                <th className="px-4 py-2 font-medium">Type</th>
                                                                <th className="px-4 py-2 font-medium">Txn ID</th>
                                                                <th className="px-4 py-2 font-medium text-right">Amount</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {flats.payment_history.map((pay) => (
                                                                <tr key={pay.id} className="hover:bg-gray-50">
                                                                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                                                                        {dayjs(pay.date).format('DD MMM YYYY')}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                                                                        {pay.type}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-gray-500 font-mono text-xs whitespace-nowrap">
                                                                        {pay.transaction_id || '-'}
                                                                    </td>
                                                                    <td className="px-4 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">
                                                                        ₹{parseFloat(pay.amount || 0).toLocaleString()}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg">
                                                    No payment history available.
                                                </div>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            </div>

                        );
                    })
                ) : (
                    <div className="text-center py-12 text-gray-500">No Flat Data Available</div>
                )}
            </div >

            {errorMessage &&
                <Errorpanel
                    errorMessages={errorMessage}
                    setErrorMessages={setErrorMessage}
                />
            }
        </>
    );
}

export default Flatinfo;
