import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Group, Text, Fileinput } from '@nayeshdaggula/tailify';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { toast } from 'react-toastify';

import { useEmployeeDetails } from '@/components/zustand/useEmployeeDetails';

function Gallerytab({ movieDetails, refreshMovies }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState(null);
    const [mediaError, setMediaError] = useState('');
    const [isLoadingEffect, setIsLoadingEffect] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [mediaKey, setMediaKey] = useState(Date.now());
    const [errorMessage, setErrorMessage] = useState(null);
    const permissions = useEmployeeDetails((state) => state.permissions);

    const [modalSize, setModalSize] = useState("65%");

    useEffect(() => {
        const handleResize = () => {
            setModalSize(window.innerWidth < 640 ? "100%" : "65%");
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Debug permissions and movieDetails
    useEffect(() => {
        console.log('Permissions:', permissions);
        console.log('Movie Details:', movieDetails);
    }, [permissions, movieDetails]);

    const openModal = () => {
        setIsModalOpen(true);
        setMediaFile(null);
        setMediaPreviewUrl(null);
        setMediaError('');
        setUploadProgress(0);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setMediaFile(null);
        setMediaPreviewUrl(null);
        setMediaError('');
        setMediaKey(Date.now());
    };

    const handleMediaChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'video/mp4',
                'video/mov',
                'video/avi',
                'video/mkv',
                'video/x-matroska'
            ];
            if (!allowedTypes.includes(file.type)) {
                setMediaError('Please upload a valid image (JPEG, PNG, GIF) or video (MP4, MOV, AVI, MKV).');
                setMediaFile(null);
                setMediaPreviewUrl(null);
                return;
            }

            const maxSizeInBytes = 500 * 1024 * 1024; // 500MB
            if (file.size > maxSizeInBytes) {
                setMediaError('File size should not exceed 500MB.');
                setMediaFile(null);
                setMediaPreviewUrl(null);
                return;
            }

            const blob = new Blob([file], { type: file.type });
            const fileUrl = URL.createObjectURL(blob);
            setMediaFile(file);
            setMediaPreviewUrl(fileUrl);
            setMediaError('');
        }
    };

    const handleMediaRemove = () => {
        setMediaFile(null);
        setMediaPreviewUrl(null);
        setMediaKey(Date.now());
        setMediaError('');
    };

    const handleMediaSubmit = (e) => {
        e.preventDefault();
        if (!mediaFile) {
            setMediaError('Please select a file to upload.');
            return;
        }

        setIsLoadingEffect(true);
        const formData = new FormData();
        formData.append('id', movieDetails.id);
        formData.append('mediaType', mediaFile.type.startsWith('image') ? 'Image' : 'Video');
        formData.append('mediaFile', mediaFile);

        Movieapi.post('uploadgallerymedia', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            }
        })
            .then((response) => {
                const data = response.data;
                if (data.status === 'error') {
                    setErrorMessage({
                        message: data.message,
                        server_res: data
                    });
                    setIsLoadingEffect(false);
                    setUploadProgress(0);
                    return;
                }
                setErrorMessage('');
                setUploadProgress(100);
                closeModal();
                toast.success('Media uploaded successfully!', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                refreshMovies();
                setIsLoadingEffect(false);
            })
            .catch((error) => {
                setErrorMessage({
                    message: 'Error uploading media',
                    server_res: error.response?.data || error
                });
                setUploadProgress(0);
                setIsLoadingEffect(false);
            });
    };

    return (
        <div className="px-3">
            <div className="flex flex-row justify-between items-center mb-4">
                <h1 className="text-lg font-normal text-black">Gallery</h1>
                <button
                    onClick={openModal}
                    className="flex items-center justify-center align-middle w-[80px] h-[32px] cursor-pointer text-white bg-[#E50914] hover:bg-[#c40812] rounded-full transition-colors"
                >
                    <span className="text-sm font-medium">Add</span>
                    <div className="p-1">
                        <IconPlus size={15} color="white" />
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6 mt-4">
                {movieDetails?.gallery?.length > 0 ? (
                    movieDetails?.gallery.map((media, index) => (
                        <div key={index} className="hover-scale-img border border-neutral-200 rounded-2xl overflow-hidden relative">
                            <div className="max-h-[266px] overflow-hidden">
                                {media.media_type === 'Image' ? (
                                    <img src={media.media_url} alt={`Gallery item ${index}`} className="w-full h-full object-cover" />
                                ) : (
                                    <video controls className="w-full h-full object-cover">
                                        <source src={media.media_url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                            {permissions?.moviesPage?.includes("movie_gallery_delete") && (
                                <div
                                    onClick={() => {
                                        setIsLoadingEffect(true);
                                        Movieapi.post('deletegallerymedia', { id: media.id })
                                            .then((response) => {
                                                const data = response.data;
                                                if (data.status === 'error') {
                                                    setErrorMessage({
                                                        message: data.message,
                                                        server_res: data
                                                    });
                                                } else {
                                                    toast.success('Media deleted successfully!', {
                                                        position: 'top-right',
                                                        autoClose: 2000
                                                    });
                                                    refreshMovies();
                                                }
                                                setIsLoadingEffect(false);
                                            })
                                            .catch((error) => {
                                                setErrorMessage({
                                                    message: 'Error deleting media',
                                                    server_res: error.response?.data || error
                                                });
                                                setIsLoadingEffect(false);
                                            });
                                    }}
                                    className="absolute top-2 right-2 w-[26px] h-[26px] flex items-center justify-center rounded-full bg-[#B10A0D] cursor-pointer"
                                >
                                    <IconTrash color="#fff" className="h-4" />
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="mt-4 text-sm text-gray-500">No gallery items available.</p>
                )}
            </div>

            {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}

            <Modal
                open={isModalOpen}
                onClose={closeModal}
                zIndex={99}
                padding='0px'
                withBorder={false}
                withCloseButton={false}
                containerClassName="!bg-white backdrop-blur-lg bg-opacity-95 !w-[95%] md:!w-[45%] lg:!w-[30%] 3xl:!w-[25%]"
                mainBodyClass="p-2 rounded-lg"
                mainHeaderClass="text-black"
                overlayClassName='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-all duration-300'
            >

                <Card className='!bg-white' padding='0px'>
                    <Card.Section>
                        <Group justify="space-between" align="center">
                            <Text size="16px" fw="bold" color='#E50914'>Add Gallery Media</Text>
                            <button
                                className="text-[#E72D65] hover:text-[#B10A0D] cursor-pointer"
                                onClick={closeModal}
                            >
                                ✕
                            </button>
                        </Group>
                    </Card.Section>

                    <Card.Section>
                        <div className='flex flex-col overflow-y-auto overflow-x-hidden'>
                            <div className="flex flex-col gap-3">
                                {mediaPreviewUrl ? (
                                    <div className="mt-4">
                                        <h1 className='text-sm font-light text-black font-sans mt-2 mb-2'>Media Preview</h1>
                                        {mediaFile?.type.startsWith('image') ? (
                                            <img src={mediaPreviewUrl} alt="Preview" className="w-full h-auto border rounded-md" />
                                        ) : (
                                            <video controls className="w-full border rounded-md">
                                                <source src={mediaPreviewUrl} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                        <button
                                            onClick={handleMediaRemove}
                                            className="mt-2 bg-red-500 text-xs text-white px-3 py-1 rounded-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <Fileinput
                                        key={mediaKey}
                                        label="Upload Media"
                                        labelClassName='text-sm !text-black font-light font-sans'
                                        withAsterisk
                                        multiple={false}
                                        value={mediaFile}
                                        error={mediaError}
                                        clearable
                                        onChange={handleMediaChange}
                                        className="border p-2 rounded-md w-full !text-sm !text-gray-600 !px-2"
                                        accept="image/jpeg,image/png,image/gif,video/mp4,video/mov,video/avi,video/mkv,video/x-matroska"
                                    />
                                )}
                            </div>
                        </div>
                    </Card.Section>

                    <Card.Section className='border-none'>
                        <div className="flex justify-end items-center gap-3">
                            <button
                                onClick={handleMediaSubmit}
                                className="text-md text-white cursor-pointer flex justify-center items-center text-sm gap-2.5 px-6 py-1.5 rounded-sm bg-[#E50914] hover:bg-[#c40812]"
                                disabled={isLoadingEffect}
                            >
                                {isLoadingEffect ? `Uploading... ${uploadProgress}%` : 'Submit'}
                            </button>
                        </div>
                    </Card.Section>
                    {errorMessage && <Errorpanel errorMessages={errorMessage} setErrorMessages={setErrorMessage} />}
                </Card>
                {isLoadingEffect && uploadProgress > 0 && (
                    <div className="absolute bg-[#000000]/90 w-full h-full top-0 right-0 z-[999999] items-center flex flex-col justify-center gap-y-2">
                        {uploadProgress === 100 ? (
                            <>
                                <p className="flex justify-between text-xs text-[#ffffff]">Please wait while we upload the media!</p>
                                <svg
                                    className="w-5 h-5 text-[#E50914] animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between text-xs text-[#ffffff]">
                                    <span>Uploading media...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-[200px] bg-[#272727] rounded-full h-2">
                                    <div
                                        className="bg-[#E50914] h-1.5 rounded-full transition-all duration-300 ease-out"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-center">
                                    <svg
                                        className="w-5 h-5 text-[#E50914] animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default Gallerytab;