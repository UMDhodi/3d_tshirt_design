import { useSnapshot } from 'valtio';
import {motion, AnimatePresence} from 'framer-motion';
import state from '../store';
import { CustomButton } from '../components';
import {
    headContainerAnimation,
    headContentAnimation,
    headTextAnimation,
    slideAnimation
} from '../config/motion'

const Home = () => {
    const snap = useSnapshot(state);
    return (
        <AnimatePresence>
            {snap.intro && (
                <motion.section className="home" {...slideAnimation('left')}>
                    <motion.header {...slideAnimation("down")}>
                        <img 
                        src='./threejs.png'
                        alt="logo"
                        className="w-8 h-8 object-contain"
                        />
                    </motion.header>

                    <motion.div className="home-contain" {...headContainerAnimation}>
                        <motion.div {...headTextAnimation}>
                            <h1 className="head-text">
                                Let's <br className="xl:block hidden" /> do it.
                            </h1>
                        </motion.div>

                        <motion.div {...headContentAnimation} className="flex flex-col gap-5">
                            <p className="max-w-md font-normal text-gray-600 text-base">
                                Unleash your creativity and design your one-of-a-kind 
                                shirt using our cutting-edge 3D customization tool. <strong>Embrace your individuality and craft a truly unique 
                                fashion statement.</strong> 
                            </p>

                            <CustomButton
                              type="filled"
                              title="Customize"
                              handleClick={() => state.intro = false}
                              customeStyles="w-fit px-4 py-2.5 font-bold text-sm"
                            >

                            </CustomButton>
                            
                        </motion.div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    )
}

export default Home