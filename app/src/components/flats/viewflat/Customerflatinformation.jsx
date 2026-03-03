import React from "react";
import { Link } from "react-router-dom"; // If Next.js, use next/link
import dayjs from "dayjs";
import { useEmployeeDetails } from "../../zustand/useEmployeeDetails";
import noImageStaticImage from "../../../../public/assets/no_image.png";

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Customerflatinformation({ customerFlatDetails }) {
  const permissions = useEmployeeDetails((state) => state.permissions);
  if (!customerFlatDetails) return null;

  const customer = customerFlatDetails.customer;

  const infoItems = [
    {
      label: "Name",
      value: `${customer?.prefixes || ""} ${capitalize(customer?.first_name) || ""} ${capitalize(
        customer?.last_name
      ) || ""}`,
      isLink: true,
      linkType: "customer",
    },
    {
      label: "Email",
      value: customer?.email,
      isLink: true,
      linkType: "email",
    },
    {
      label: "Phone Number",
      value: `+${customer?.phone_code} ${customer?.phone_number}`,
      isLink: true,
      linkType: "phone",
    },
    {
      label: "Date of Birth",
      value: customer?.date_of_birth
        ? dayjs(customer?.date_of_birth).format("DD/MM/YYYY")
        : "-",
    },
    { label: "Mother Tongue", value: customer?.mother_tongue },
    { label: "Pan Card No.", value: customer?.pan_card_no },
    {
      label: "Aadhar Card No.",
      value: customer?.aadhar_card_no?.replace(/(\d{4})(?=\d)/g, "$1-"),
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start">
      {/* Profile Image */}
      <div className="w-full md:w-[200px] flex justify-center items-center">
        <img
          crossOrigin="anonymous"
          src={customer?.profile_pic_url || noImageStaticImage}
          alt="Profile"
          className="w-full h-[180px] rounded-lg object-cover border border-gray-300"
        />
      </div>

      {/* Info Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {infoItems.map(({ label, value, isLink, linkType }) => {
          let content = value || "-";

          if (isLink && value) {
            if (linkType === "customer") {
              if (permissions?.customers_page?.includes("view_single_customer")) {
                content = (
                  <Link
                    to={`/customers/${customer?.uuid}`}
                    className="text-blue-500 hover:underline"
                  >
                    {value}
                  </Link>
                );
              } else {
                content = value;
              }
            } else if (linkType === "email") {
              content = (
                <a
                  href={`mailto:${value}`}
                  className="text-blue-500 hover:underline"
                >
                  {value}
                </a>
              );
            } else if (linkType === "phone") {
              content = (
                <a
                  href={`https://wa.me/${value.replace(
                    /[^0-9]/g,
                    ""
                  )}?text=Hello!%20I%27m%20interested%20in%20your%20service`}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value}
                </a>
              );
            }
          }

          return (
            <div key={label} className="flex flex-col gap-y-1">
              <p className="text-sm text-gray-600">{label}</p>
              <p className="text-sm text-gray-900 font-semibold">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Customerflatinformation;
