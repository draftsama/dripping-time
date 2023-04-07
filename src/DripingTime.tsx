
import { Button, Center, CircularProgress, CircularProgressLabel, Container, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stat, StatLabel, StatNumber, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { DripProp } from './App';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    datas: DripProp[];
}

enum DripState {
    PreDrip = 'เตรียมดริป',
    PreDripNext = 'เตรียมดริปครั้งถัดไป',
    Driping = 'กำลังดริป',
    Finnish = 'การดริปเสร็จสิ้น'
}

const audioAlarm = new Audio('alarm-clock.wav');
const audioSuccess = new Audio('success.wav');

const DripingTime = (props: Props) => {

    const [timeCount, setTimeCount] = useState(0);
    const [targetWater, setTargetWater] = useState(0);

    const [progress, setProgress] = useState(0);
    const [state, setTate] = useState<DripState>(DripState.PreDrip);

    const [currentData, setCurrentData] = useState<DripProp | null>(null);


    useEffect(() => {
        if (props.isOpen) {

            console.log("open");
            let index = 0;
            let timer = props.datas[index].time;

            setCurrentData(props.datas[index]);
            setTimeCount(timer)
            setProgress(timer / props.datas[index].time)
            setTargetWater(props.datas[index].water)
            let intervalId: number | undefined = undefined;
            setTate(DripState.PreDrip)

            intervalId = setInterval(() => {
                timer--;

                if (timer >= 0) {

                    setTimeCount(timer)
                    setProgress(timer / props.datas[index].time)
                    if (timer == 4 && index + 1 < props.datas.length) {
                        audioAlarm.play();

                    }
                    if (timer <= 4 && index + 1 < props.datas.length) {
                        setTate(DripState.PreDripNext)
                    } else {
                        setTate(DripState.Driping)
                    }


                } else {
                    index++;
                    if (index < props.datas.length) {
                        setTargetWater((prev) => prev + props.datas[index].water)

                        setCurrentData(props.datas[index]);
                        timer = props.datas[index].time;
                        setProgress(timer / props.datas[index].time)
                        setTimeCount(timer)
                    } else {
                        // props.onClose();
                        audioSuccess.play();
                        setProgress(0)
                        setTimeCount(0)
                        clearInterval(intervalId!);
                        setTate(DripState.Finnish)


                    }

                }


            }, 1000)

            return () => {
                console.log("close");
                audioAlarm.pause();
                audioAlarm.currentTime = 0;

                audioSuccess.pause();
                audioSuccess.currentTime = 0;

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
                        <VStack>
                            <Center>
                                <CircularProgress value={(1 - progress) * 100} size='200px' color='blue.400'>
                                    <CircularProgressLabel>{timeCount}</CircularProgressLabel>
                                </CircularProgress>
                            </Center>
                            <Container>
                                <Stat>
                                    <StatLabel color='blue.400'>{state}</StatLabel>

                                    <StatLabel>น้ำที่ใช้ในรอบนี้:</StatLabel>
                                    <StatNumber>{currentData?.water} ml.</StatNumber>
                                    <StatLabel>เป้าหมายปริมาณน้ำในรอบนี้:</StatLabel>
                                    <StatNumber>{targetWater} ml.</StatNumber>
                                </Stat>


                            </Container>
                        </VStack>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme={state == DripState.Finnish ? 'twitter' : 'red'} mr={3} onClick={props.onClose}>
                            {state == DripState.Finnish ? 'เสร็จสิ้น' : 'หยุด'}
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DripingTime