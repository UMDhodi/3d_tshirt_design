import React, {useState, useEffect} from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { useSnapshot } from 'valtio';
import config from '../config/config';
import state from '../store';
import { download } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes, DownloadTabs} from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { AIPicker, ColorPicker, CustomButton, FilePicker, Tab } from '../components';

const Customizer = () => {
    const  snap = useSnapshot(state);
    const [file, setFile] = useState('');
    const [prompt, setPrompt] = useState('');
    const [generatingImg, setGeneratingImg] = useState('');
    const [activeEditorTab, setActiveEditorTab] = useState('');
    const [activeFilterTab, setActiveFilterTab] = useState({
        logoShirt:true,
        stylishShirt:false,
    });


    // Show tab content depending on the active tab
    const generateTabContent = () => {
        switch (activeEditorTab) {
            case "colorpicker":
                return <ColorPicker />
            case "filepicker":
                return <FilePicker 
                    file={file}
                    setFile={setFile}
                    readFile={readFile}
                />    
            case "aipicker":
                return <AIPicker 
                    prompt={prompt}
                    setPrompt={setPrompt}
                    generatingImg={generatingImg}
                    handleSubmit={handleSubmit}
                />    
            default:
                return null;
        }
    }

    const handleSubmit = async (type) => {
        if (!prompt) return alert("Please enter a prompt");
        
        try {
            // Call our backend to generate an AI image!
            setGeneratingImg(true);

            const response = await fetch('http://localhost:8080/api/v1/dalle', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                prompt,
                })
            })

            const data = await response.json();
            handleDecals(type, `data:image/png;base64,${data.photo}`)

        } catch (error) {
            alert(error)
        } finally {
            setGeneratingImg(false);
            setActiveEditorTab("");
        }
    }

    const handleDecals = (type, result) => {
        const decalType = DecalTypes[type];

        state[decalType.stateProperty] = result;

        if (!activeFilterTab[decalType.filterTab]) {
            handleActiveFilterTab(decalType.filterTab)
        }
    }

    const handleActiveFilterTab = (tabName) => {
        switch (tabName) {
            case "logoShirt":
                state.isLogoTexture = !activeFilterTab[tabName];
                break;

            case "stylishShirt":
                state.isFullTexture = !activeFilterTab[tabName];
                break;
            default:
                state.isLogoTexture = true;
                state.isFullTexture = false;
                break;
                
        }

        // After seting the state, activeFilterTab is update
        setActiveFilterTab((prevState) => {
            return{
                ...prevState,
                [tabName]: !prevState[tabName]
            }
        })
    }

    const readFile = (type) => {
        reader(file)
        .then((result) => {
            handleDecals(type, result);
            setActiveEditorTab("");
        })
    }

    return (
        <AnimatePresence>
            {!snap.intro && (
                <>
                    <motion.div className="absolute top-0 left-0 z-10" 
                        key="custom"
                        {...slideAnimation('left')}
                    >
                        <div className="flex items-center min-h-screen">
                            <div className="editortabs-container tabs">
                                {EditorTabs.map((tab) => (
                                    <Tab
                                        key={tab.name}
                                        tab={tab}
                                        handleclick={() => setActiveEditorTab(tab.name)}
                                    />
                                ))}

                                {generateTabContent()}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="absolute z-10 top-5 right-5"
                        {...fadeAnimation}
                    >
                        <CustomButton
                            type="filled"
                            title="Home"
                            handleClick={() => state.intro = true}
                        />
                    </motion.div>

                    <motion.div
                        className="filtertabs-container"
                        {...slideAnimation('up')}
                    >
                        {FilterTabs.map((tab) => (
                            <Tab 
                                key={tab.name}
                                tab={tab}
                                isFilterTab
                                isActiveTab={activeFilterTab[tab.name]}
                                handleclick={() => handleActiveFilterTab(tab.name)}
                            />
                        ))}
                        {DownloadTabs.map((tab) => (
                            <Tab 
                            key={tab.name}
                            tab={tab}
                            handleClick={downloadCanvasToImage}
                            />
                        ))}
                    </motion.div>

                </>
            )}
        </AnimatePresence>

    )
}

export default Customizer