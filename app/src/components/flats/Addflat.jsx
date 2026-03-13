import React, { useEffect, useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEmployeeDetails } from "../zustand/useEmployeeDetails";
import {
  Loadingoverlay,
  Textarea,
} from "@nayeshdaggula/tailify";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Flatapi from "../api/Flatapi.jsx";
import Projectapi from "../api/Projectapi.jsx";
import Groupownerapi from "../api/Groupownerapi.jsx";
import Errorpanel from "../shared/Errorpanel";

function Addflat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerUid = searchParams.get("customer");

  const employeeInfo = useEmployeeDetails((state) => state.employeeInfo);
  const employee_id = employeeInfo?.id || null;

  const [flatNo, setFlatNo] = useState("");
  const [flatNoError, setFlatNoError] = useState("");
  const updateFlatNo = (e) => {
    const value = e.target.value;
    setFlatNo(value);
    setFlatNoError("");
  };

  const [UDL, setUDL] = useState("");
  const [udlError, setUDLError] = useState("");
  const updateUDL = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setUDL(value);
    setUDLError("");
  };

  const [groupOwners, setGroupOwners] = useState([]);
  const [groupOwnersError, setGroupOwnersError] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const handleOwnerChange = (value) => {
    setSelectedOwner(value);
    setGroupOwnersError("");
  };

  const [block, setBlock] = useState("");
  const [blockError, setBlockError] = useState("");
  const updateBlock = (value) => {
    setBlock(value);
    setBlockError("");
  };

  const [FloorNo, setFloorNo] = useState("");
  const [FloorNoError, setFloorNoError] = useState("");
  const updateFloorNo = (value) => {
    setFloorNo(value);
    setFloorNoError("");
  };

  const [deedNo, setDeedNo] = useState("");
  const [deedNoError, setDeedNoError] = useState("");
  const updateDeedNo = (e) => {
    const value = e.target.value;
    setDeedNo(value);
    setDeedNoError("");
  };

  const [squareFeet, setSquareFeet] = useState("");
  const [squareFeetError, setSquareFeetError] = useState("");
  const updateSquareFeet = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setSquareFeet(value);
    setSquareFeetError("");
  };

  const [parkingSquareFeet, setParkingSquareFeet] = useState("");
  const [parkingSquareFeetError, setParkingSquareFeetError] = useState("");
  const updateParkingSquareFeet = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setParkingSquareFeet(value);
    setParkingSquareFeetError("");
  };

  const [flatType, setFlatType] = useState("");
  const [flatTypeError, setFlatTypeError] = useState("");
  const updateFlatType = (value) => {
    setFlatType(value);
    setFlatTypeError("");
  };

  const [facing, setFacing] = useState("");
  const [facingError, setFacingError] = useState("");
  const updateFacing = (value) => {
    setFacing(value);
    setFacingError("");
  };

  const [bedrooms, setBedrooms] = useState("");
  const [bedroomsError, setBedroomsError] = useState("");
  const updateBedrooms = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBedrooms(value);
    setBedroomsError("");
  };

  const [bathrooms, setBathrooms] = useState("");
  const [bathroomsError, setBathroomsError] = useState("");
  const updateBathrooms = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBathrooms(value);
    setBathroomsError("");
  };

  const [balconies, setBalconies] = useState("");
  const [balconiesError, setBalconiesError] = useState("");
  const updateBalconies = (e) => {
    let value = e.target.value;
    // remove non-digit characters
    value = value.replace(/\D/g, "");
    setBalconies(value);
    setBalconiesError("");
  };

  const [eastFace, setEastFace] = useState("");
  const [eastFaceError, setEastFaceError] = useState("");
  const updateEastFace = (e) => {
    let value = e.target.value;
    setEastFace(value);
    setEastFaceError("");
  };

  const [westFace, setWestFace] = useState("");
  const [westFaceError, setWestFaceError] = useState("");
  const updateWestFace = (e) => {
    let value = e.target.value;
    setWestFace(value);
    setWestFaceError("");
  };

  const [northFace, setNorthFace] = useState("");
  const [northFaceError, setNorthFaceError] = useState("");
  const updateNorthFace = (e) => {
    let value = e.target.value;
    setNorthFace(value);
    setNorthFaceError("");
  };

  const [southFace, setSouthFace] = useState("");
  const [southFaceError, setSouthFaceError] = useState("");
  const updateSouthFace = (e) => {
    let value = e.target.value;
    setSouthFace(value);
    setSouthFaceError("");
  };

  const [parking, setParking] = useState(false);
  const [parkingError, setParkingError] = useState("");
  const updateParking = (value) => {
    setParking(value);
    setParkingError("");
  };

  const [corner, setCorner] = useState(false);
  const [cornerError, setCornerError] = useState("");
  const updateCorner = (value) => {
    setCorner(value);
    setCornerError("");
  };

  const [mortgage, setMortgage] = useState(false);
  const [mortgageError, setMortgageError] = useState("");
  const updateMortgage = (value) => {
    setMortgage(value);
    setMortgageError("");
  };

  const [floorRise, setFloorRise] = useState(false);
  const [floorRiseError, setFloorRiseError] = useState("");
  const updateFloorRise = (value) => {
    setFloorRise(value);
    setFloorRiseError("");
  };

  const [furnishingStatus, setFurnishingStatus] = useState("");
  const [furnishingStatusError, setFurnishingStatusError] = useState("");
  const updateFurnishingStatus = (value) => {
    setFurnishingStatus(value);
    setFurnishingStatusError("");
  };

  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const updateDescription = (e) => {
    const value = e.target.value;
    setDescription(value);
    setDescriptionError("");
  };

  const [googleMapLink, setGoogleMapLink] = useState("");
  const [googleMapLinkError, setGoogleMapLinkError] = useState("");
  const updateGoogleMapLink = (e) => {
    const value = e.target.value;
    setGoogleMapLink(value);
    setGoogleMapLinkError("");
  };
  const [flatReward, setFlatReward] = useState(false);
  const [flatRewardError, setFlatRewardError] = useState("");
  const updateFlatReward = (value) => {
    setFlatReward(value === "true");
    setFlatRewardError("");
  };

  const [isLoadingEffect, setIsLoadingEffect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blocks, setBlocks] = useState([]);

  const fetchblocks = async () => {
    setIsLoadingEffect(true);

    Projectapi.get("get-blocks-label")
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          setErrorMessage(data.message);
          setIsLoadingEffect(false);
          return false;
        }
        const blocks = data.blocks;
        setBlocks(blocks);
        setIsLoadingEffect(false);
        setErrorMessage("");
        return false;
      })
      .catch((error) => {
        console.log(error);
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
        setIsLoadingEffect(false);
        setErrorMessage(finalresponse);
        return false;
      });
  };

  async function fetchGroupOwners() {
    setIsLoadingEffect(true);
    try {
      const response = await Groupownerapi.get("/get-list-group-owners");
      const data = response?.data;
      if (data.status === "error") {
        setErrorMessage({
          message: data.message,
          server_res: data,
        });
        setIsLoadingEffect(false);
        return false;
      }
      setGroupOwners(data?.groupOwners);

      setIsLoadingEffect(false);
      return true;
    } catch (error) {
      console.error("fetchGroupOwners error:", error);
      const finalresponse = {
        message: error.message || "Failed to fetch group owners",
        server_res: error.response?.data || null,
      };
      setErrorMessage(finalresponse);
      setIsLoadingEffect(false);
      return false;
    }
  }

  const handleSubmit = () => {
    setIsLoadingEffect(true);

    if (flatNo === "" || !flatNo) {
      setIsLoadingEffect(false);
      setFlatNoError("Enter Flat No");
      return false;
    }

    if (FloorNo === "" || !FloorNo) {
      setIsLoadingEffect(false);
      setFloorNoError("Enter Floor No");
      return false;
    }

    if (block === "" || !block) {
      setIsLoadingEffect(false);
      setBlockError("Enter Block");
      return false;
    }

    // if (selectedOwner === "" || !selectedOwner) {
    //   setIsLoadingEffect(false);
    //   setGroupOwnersError("Enter Group/Owner");
    //   return false;
    // }

    // if (mortgage === "" || !mortgage) {
    //   setIsLoadingEffect(false);
    //   setMortgageError("Enter Mortgage ?");
    //   return false;
    // }

    if (squareFeet === "" || !squareFeet) {
      setIsLoadingEffect(false);
      setSquareFeetError("Enter Square Feet");
      return false;
    }

    if (flatType === "" || !flatType) {
      setIsLoadingEffect(false);
      setFlatTypeError("Select Flat Type");
      return false;
    }

    if (googleMapLink && !googleMapLink.startsWith("https://")) {
      setIsLoadingEffect(false);
      setGoogleMapLinkError("Invalid google map link");
      return false;
    }

    const googleMapRegex = /^https:\/\/(www\.)?google\.[a-z.]+\/maps|^https:\/\/maps\.app\.goo\.gl\//;

    if (googleMapLink && !googleMapRegex.test(googleMapLink)) {
      setIsLoadingEffect(false);
      setGoogleMapLinkError("Enter a valid Google Map link");
      return false;
    }

    if (!selectedProject) {
      setIsLoadingEffect(false);
      setSelectedProjectError("Select Project");
      return false;
    }

    const formData = {
      employee_id: employee_id,
      project_id: selectedProject,
      flatNo: flatNo,
      block: block,
      floorNo: FloorNo,
      squareFeet: squareFeet,
      flatType: flatType,
      facing: facing,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      balconies: balconies,
      furnishingStatus: furnishingStatus,
      description: description,
      parking: parkingSquareFeet,
      udlNo: UDL,
      group_owner: selectedOwner,
      east_face: eastFace,
      west_face: westFace,
      north_face: northFace,
      south_face: southFace,
      corner: corner,
      mortgage: mortgage,
      deedNo: deedNo,
      // floorRise: floorRise,
      google_map_link: googleMapLink,
      flat_reward: flatReward,
    };

    Flatapi.post("flats/add-flat", formData)
      .then((response) => {
        let data = response.data;
        if (data.status === "error") {
          let finalresponse = {
            message: data.message,
            server_res: data,
          };
          setErrorMessage(finalresponse);
          setIsLoadingEffect(false);
          return false;
        }
        if (customerUid) {
          navigate(
            `/flats?openDrawer=true&flat=${flatNo}&customer=${customerUid}&project=${selectedProject}`
          );
        } else {
          navigate("/flats");
        }
        setErrorMessage("");
        setIsLoadingEffect(false);
        return false;
      })
      .catch((error) => {
        console.log(error);
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
  };

  const [projects, setProjects] = useState([]);
  const [rawProjects, setRawProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectError, setSelectedProjectError] = useState("");
  const handleProjectChange = (value) => {
    setSelectedProject(value);
    setSelectedProjectError("");
  };

  const fetchProjects = async () => {
    setIsLoadingEffect(true);
    Projectapi.get("get-all-projects")
      .then((response) => {
        const data = response.data;
        if (data.status === "error") {
          // Handle error if needed, or just log
          console.error("Error fetching projects:", data.message);
        } else {
          const projectOptions = (data.data || []).map(p => ({
            value: String(p.id),
            label: p.project_name
          }));
          setProjects(projectOptions);
          setRawProjects(data.data || []);

          // Optional: Select the first project by default if available
          // if (projectOptions.length > 0) {
          //     setSelectedProject(projectOptions[0].value);
          // }
        }
        // Don't turn off loading here as other fetches might be running, 
        // or handle loading state more granularly. 
        // For now, let's just let the other independent fetches handle their own loading or global loading.
        // Actually, since we set isLoadingEffect(true) at start of this function, we should ideally turn it off or manage it.
        // But existing code has multiple fetches in useEffect. simpler to just not block UI too much.
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
    // Not disabling loading here to avoid conflict with other parallel fetches if they share same loading state
  };

  useEffect(() => {
    fetchblocks();
    fetchGroupOwners();
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-semibold">Add Flat</h1>
        <Link
          to={"/flats"}
          className="text-[#0083bf] px-3 gap-1 flex items-center justify-center p-1 rounded-sm border border-[#0083bf] bg-white transition-colors duration-200"
        >
          <IconArrowLeft className="mt-0.5" size={18} color="#0083bf" />
          Back
        </Link>
      </div>

      <div className="relative bg-white p-6 rounded-[4px] border-[0.6px] border-[#979797]/40">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Project <span className="text-red-500">*</span></label>
              <Select value={selectedProject ? String(selectedProject) : undefined} onValueChange={handleProjectChange}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!selectedProject ? 'text-gray-400' : ''} ${selectedProjectError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 max-h-[200px]">
                  {projects.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProjectError && <p className="text-xs text-red-500">{selectedProjectError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Flat No <span className="text-red-500">*</span></label>
              <Input
                placeholder="Enter Flat No"
                value={flatNo}
                onChange={updateFlatNo}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${flatNoError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {flatNoError && <p className="text-xs text-red-500">{flatNoError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Floor No <span className="text-red-500">*</span></label>
              <Select value={FloorNo ? String(FloorNo) : undefined} onValueChange={updateFloorNo}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!FloorNo ? 'text-gray-400' : ''} ${FloorNoError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Floor No" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 max-h-[200px]">
                  {Array.from({ length: 100 }, (_, i) => ({
                    value: String(i + 1),
                    label: ` ${i + 1}`,
                  })).map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {FloorNoError && <p className="text-xs text-red-500">{FloorNoError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Block <span className="text-red-500">*</span></label>
              <Select value={block ? String(block) : undefined} onValueChange={updateBlock}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!block ? 'text-gray-400' : ''} ${blockError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Block" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 max-h-[200px]">
                  {blocks.map((item) => (
                    <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {blockError && <p className="text-xs text-red-500">{blockError}</p>}
            </div>

            {/* <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Mortgage <span className="text-red-500">*</span></label>
              <Select value={mortgage !== undefined ? String(mortgage) : undefined} onValueChange={(val) => updateMortgage(val === "true")}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${mortgageError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Mortgage" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              {mortgageError && <p className="text-xs text-red-500">{mortgageError}</p>}
            </div> */}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Area (Sq.ft.) <span className="text-red-500">*</span></label>
              <Input
                placeholder="Enter Square Feet"
                value={squareFeet}
                onChange={updateSquareFeet}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${squareFeetError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {squareFeetError && <p className="text-xs text-red-500">{squareFeetError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Flat Type <span className="text-red-500">*</span></label>
              <Select value={flatType || undefined} onValueChange={updateFlatType}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!flatType ? 'text-gray-400' : ''} ${flatTypeError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  <SelectItem value="2 BHK">2 BHK</SelectItem>
                  <SelectItem value="3 BHK">3 BHK</SelectItem>
                </SelectContent>
              </Select>
              {flatTypeError && <p className="text-xs text-red-500">{flatTypeError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Facing</label>
              <Select value={facing || undefined} onValueChange={updateFacing}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${!facing ? 'text-gray-400' : ''} ${facingError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Select Facing" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 max-h-[200px]">
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                  <SelectItem value="NorthEast">NorthEast</SelectItem>
                  <SelectItem value="NorthWest">NorthWest</SelectItem>
                  <SelectItem value="SouthEast">SouthEast</SelectItem>
                  <SelectItem value="SouthWest">SouthWest</SelectItem>
                </SelectContent>
              </Select>
              {facingError && <p className="text-xs text-red-500">{facingError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">East Facing View</label>
              <Input
                placeholder="Enter POV"
                value={eastFace}
                onChange={updateEastFace}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${eastFaceError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {eastFaceError && <p className="text-xs text-red-500">{eastFaceError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">West Facing View</label>
              <Input
                placeholder="Enter POV"
                value={westFace}
                onChange={updateWestFace}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${westFaceError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {westFaceError && <p className="text-xs text-red-500">{westFaceError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">North Facing View</label>
              <Input
                placeholder="Enter POV"
                value={northFace}
                onChange={updateNorthFace}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${northFaceError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {northFaceError && <p className="text-xs text-red-500">{northFaceError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">South Facing View</label>
              <Input
                placeholder="Enter POV"
                value={southFace}
                onChange={updateSouthFace}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${southFaceError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {southFaceError && <p className="text-xs text-red-500">{southFaceError}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Corner</label>
              <Select value={corner !== undefined ? String(corner) : undefined} onValueChange={(val) => updateCorner(val === "true")}>
                <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${cornerError ? 'border-red-500' : 'border-gray-300'}`}>
                  <SelectValue placeholder="Is Corner ?" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200">
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              {cornerError && <p className="text-xs text-red-500">{cornerError}</p>}
            </div>

            {rawProjects.find(p => p.id === selectedProject)?.project_rewards && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-600 mb-1">Flat Reward</label>
                <Select value={flatReward !== undefined ? String(flatReward) : undefined} onValueChange={(val) => updateFlatReward(val)}>
                  <SelectTrigger className={`w-full h-10 border rounded-md focus:border-black focus:ring-0 focus:ring-offset-0 focus:outline-none ${flatRewardError ? 'border-red-500' : 'border-gray-300'}`}>
                    <SelectValue placeholder="Flat Reward ?" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200">
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                {flatRewardError && <p className="text-xs text-red-500">{flatRewardError}</p>}
              </div>
            )}

            {/* <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600 mb-1">Google Map Link</label>
              <Input
                placeholder="Enter Google Map Link"
                value={googleMapLink}
                onChange={updateGoogleMapLink}
                className={`w-full px-3 py-2 border rounded-md focus:border-black focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors duration-200 placeholder-gray-400 ${googleMapLinkError ? 'border-red-500' : 'border-gray-300'}`}
              />
              {googleMapLinkError && <p className="text-xs text-red-500">{googleMapLinkError}</p>}
            </div> */}
          </div>
          {isLoadingEffect ? (
            isLoadingEffect && (
              <div className="absolute inset-0 bg-[#2b2b2bcc] flex flex-row justify-center items-center  rounded">
                <Loadingoverlay visible={isLoadingEffect} overlayBg="" />
              </div>
            )
          ) : (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-[14px] text-white bg-[#0083bf] rounded cursor-pointer"
              >
                {customerUid ? "Add and Assign Flat" : "Add Flat"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* {errorMessage && <p className="text-sm text-[#ec0606]">{errorMessage}</p>} */}
      {errorMessage !== "" && (
        <Errorpanel
          errorMessages={errorMessage}
          setErrorMessages={setErrorMessage}
        />
      )}
    </div>
  );
}

export default Addflat;
