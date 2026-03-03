import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImageHelper.jsx";
import { Button } from "@nayeshdaggula/tailify";

const CROP_AREA_ASPECT_FEATURE = 2.5 / 2;
const CROP_AREA_ASPECT_TEAM = 2.5 / 3;

const Output = ({ croppedArea, image }) => {
    const scale = 100 / croppedArea.width;
    const transform = {
        x: `${-croppedArea.x * scale}%`,
        y: `${-croppedArea.y * scale}%`,
        scale,
        width: "calc(100% + 0.5px)",
        height: "auto"
    };

    const imageStyle = {
        transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${transform.scale},${transform.scale},1)`,
        width: transform.width,
        height: transform.height
    };

    return (
        <div
            className="output"
            style={{ paddingBottom: `${100 / CROP_AREA_ASPECT}%` }}
        >
            <img src={image} alt="" style={imageStyle} />
        </div>
    );
};

export default function CropImage({ image, onClose, setCroppedImage, size }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedArea(croppedArea);
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSubmit = async () => {
        try {
            const croppedImg = await getCroppedImg(image, croppedAreaPixels);
            setCroppedImage(croppedImg);
            onClose();
        } catch (e) {
            console.error("Error cropping image:", e);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-2">
            <div className="flex flex-col md:flex-row text-center w-full">
                <div className="flex flex-col md:flex-row gap-2 overflow-hidden justify-between w-full">
                    <div className="cropper w-full  relative">
                        <Cropper
                            image={image}
                            aspect={size === "team" ? CROP_AREA_ASPECT_TEAM : CROP_AREA_ASPECT_FEATURE}
                            crop={crop}
                            zoom={zoom}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropAreaChange={onCropComplete}
                        // classes={{
                        //     containerClassName: 'rounded-md',
                        // }}
                        />
                    </div>
                    {/* <div className="viewer">
                        <div>{croppedArea && <Output croppedArea={croppedArea} image={image} />}</div>
                    </div> */}
                </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-2 mt-2">
                <Button
                    className="cursor-pointer !bg-[#000] text-white rounded-md !text-[13px]"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    className="cursor-pointer bg-[#044093] text-white rounded-md !px-6 !text-[13px]"
                    onClick={handleSubmit}
                >
                    Crop
                </Button>

            </div>
        </div>
    );
}
