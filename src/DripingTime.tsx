
import { Button, CircularProgress, CircularProgressLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { DripProp } from './App';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    datas: DripProp[];
}
const audio = new Audio('alarm-clock.wav');

const DripingTime = (props: Props) => {

    const [timeCount, setTimeCount] = useState(0);
    const [progress, setProgress] = useState(0);

    const [currentData, setCurrentData] = useState<DripProp | null>(null);


    useEffect(() => {
        if (props.isOpen) {

            console.log("open");
            let index = 0;
            let timer = props.datas[index].time;

            setCurrentData(props.datas[index]);
            setTimeCount(timer)
            setProgress(timer / props.datas[index].time)
            let intervalId: number | undefined = undefined;

            intervalId = setInterval(() => {

                timer--;

                if (timer >= 0) {

                    setTimeCount(timer)
                    setProgress(timer / props.datas[index].time)
                    if (timer == 4) {
                        audio.play();
                    }
                } else {
                    index++;
                    if (index < props.datas.length) {

                        setCurrentData(props.datas[index]);
                        timer = props.datas[index].time;
                        setProgress(timer / props.datas[index].time)
                        setTimeCount(timer)
                    } else {
                        // props.onClose();
                        audio.play();
                        setProgress(0)
                        setTimeCount(0)
                        clearInterval(intervalId!);

                    }

                }


            }, 1000)

            return () => {
                console.log("close");
                audio.pause();
                audio.currentTime = 0;

                clearInterval(intervalId!);
            }
        }
    }, [props.isOpen])





    return (
        <>
            <Modal isOpen={props.isOpen} closeOnEsc={false} closeOnOverlayClick={false} onClose={props.onClose} >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>รอบที่ {currentData?.id}</ModalHeader>
                    <ModalBody>

                        <CircularProgress value={(1 - progress) * 100} size='100px' color='green.400'>
                            <CircularProgressLabel>{timeCount}</CircularProgressLabel>
                        </CircularProgress>
                        <> ใช้น้ำ{currentData?.water} ml.</>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={props.onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DripingTime