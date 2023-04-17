import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Stack, Stat, StatHelpText, StatLabel, StatNumber, Switch, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack, useDisclosure } from '@chakra-ui/react'
import DripingTime from './DripingTime'


const presetDatas: PresetData[] = [{
  index: 0, name: "สูตรเย็น1", data: {
    coffee: 18,
    cwIndex: 3,
    iwIndex: 1,
    dripTasks: [
      { id: 1, time: 40, water: 25 },
      { id: 2, time: 40, water: 35 },
      { id: 3, time: 40, water: 67 },
      { id: 4, time: 40, water: 35 },
    ]
  }
}, {
  index: 1, name: "สูตรร้อน1", data: {
    coffee: 15,
    cwIndex: 3,
    iwIndex: 0,
    dripTasks: [
      { id: 1, time: 35, water: 40 },
      { id: 2, time: 35, water: 40 },
      { id: 3, time: 35, water: 65 },
      { id: 4, time: 35, water: 40 },
      { id: 4, time: 35, water: 40 },
    ]
  }
}]




const cwRatioData = [
  { index: 0, ratio: 10, option: "1:10" },
  { index: 1, ratio: 12, option: "1:12" },
  { index: 2, ratio: 13, option: "1:13" },
  { index: 3, ratio: 15, option: "1:15" },
  { index: 4, ratio: 17, option: "1:17" },
  { index: 5, ratio: 18, option: "1:18" },
  { index: 6, ratio: 20, option: "1:20" }];

const iwRatioData = [
  { index: 0, ratio: 0, option: "ไม่ใส่" },
  { index: 1, ratio: 0.4, option: "4:6" },
  { index: 2, ratio: 0.5, option: "5:5" }
]
const DRIP_WATER_DEFAULT = 40;
const DRIP_TIMER_DEFAULT = 40;
const COFFEE_DEFAULT = 15;
const DRIP_LOOP_DEFAULT = 5;
const COFFEE_WATER_RATIO_DEFAULT_INDEX = 3;
const ICE_WATER_RATIO_DEFAULT_INDEX = 1;



export type DripProp = {
  id: number,
  water: number
  time: number
}

type DripData = {
  coffee: number;
  cwIndex: number; //coffee to water ratio index
  iwIndex: number; //ice to water ratio index
  dripTasks: DripProp[]
}

type PresetData = {
  index: number,
  name: string,
  data: DripData
}
function App() {

  const [presetIndex, setPresetIndex] = useState<number>(0)
  const [currentData, setCurrentData] = useState<DripData>(presetDatas[presetIndex].data)



  const [water, setWater] = useState(0)
  const [dripTime, setDripTime] = useState(0)
  const [diffWater, setDiffWater] = useState(0)

  const [ice, setIce] = useState(0)

  const { isOpen, onOpen, onClose } = useDisclosure()







  useEffect(() => {

    const cwRatio = cwRatioData[currentData.cwIndex].ratio;
    const iwRatio = iwRatioData[currentData.iwIndex].ratio;
    const waterTarget = Math.round((currentData.coffee * cwRatio) * 100) / 100;
    const iceTarget = waterTarget * iwRatio
    const w = waterTarget - iceTarget;

    const dif = currentData.dripTasks.reduce((acc, list) => acc + list.water, 0) - w;
    setDripTime(currentData.dripTasks.reduce((acc, list) => acc + list.time, 0))


    setDiffWater(dif);
    setIce(iceTarget);
    setWater(w)
  }, [currentData])

  useEffect(() => {
    //initialize
    // var list: DripProp[] = []
    // for (let index = 0; index < DRIP_LOOP_DEFAULT; index++) {
    //   list.push({ id: index + 1, water: DRIP_WATER_DEFAULT, time: DRIP_TIMER_DEFAULT })
    // }



    // setDripList(list);

    return () => {

    }
  }, [])



  return (
    <Stack spacing={4}>
      <FormControl>

        <FormLabel mt={2}>ตัวเลือกที่เซ็ตไว้:</FormLabel>
        <Select placeholder='Select option' value={presetIndex} onChange={(event) => {

          var index = Number(event.target.value);
          setPresetIndex(index);

          setCurrentData(presetDatas[index].data);

        }}>
          {
            presetDatas.map((item) => (
              <option key={item.index} value={item.index}>{item.name}</option>
            ))
          }

        </Select>

        <FormLabel mt={2}>จำนวนเมล็ดกาแฟ (g):</FormLabel>
        <NumberInput value={currentData.coffee} min={10} onChange={(s, n) => {
          setCurrentData((data) => {
            var newData = { ...data };
            newData.coffee = isNaN(n) ? 0 : n
            return newData;
          });
        }}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormLabel mt={2}>อัตราส่วน เมล็ดกาแฟ ต่อ น้ำ:</FormLabel>
        <Select placeholder='Select option' value={currentData.cwIndex} onChange={(event) => {
          setCurrentData((data) => {
            var newData = { ...data };
            newData.cwIndex = Number(event.target.value);
            return newData;
          });

        }}>
          {
            cwRatioData.map((item) => (
              <option key={item.index} value={item.index}>{item.option}</option>
            ))
          }

        </Select>



        <FormLabel mt={2}>อัตราส่วน น้ำแข็ง ต่อ น้ำ:</FormLabel>
        <Select placeholder='Select option' value={currentData.iwIndex} onChange={(event) => {

          setCurrentData((data) => {
            var newData = { ...data };
            newData.iwIndex = Number(event.target.value);
            return newData;
          });
        }}>
          {
            iwRatioData.map((item) => (
              <option key={item.index} value={item.index}>{item.option}</option>
            ))
          }

        </Select>

      </FormControl>




      {/* <Text>เมล็ดกาแฟ 1 g. ต่อน้ำ {ratio} ml.</Text> */}

      <FormLabel mt={2}>จำนวนรอบในการดริป: {currentData.dripTasks.length} รอบ</FormLabel>

      <Slider value={currentData.dripTasks.length} min={3} max={5} step={1} onChange={(value) => {
        let newData = { ...currentData }

        if (value > newData.dripTasks.length) {

          const start = newData.dripTasks.length;
          const max = value;
          for (let index = start; index < max; index++) {

            newData.dripTasks.push({ id: index + 1, water: DRIP_WATER_DEFAULT, time: DRIP_TIMER_DEFAULT });
          }

          setCurrentData(newData)
        } else if (value < newData.dripTasks.length) {

          const start = value;
          const max = newData.dripTasks.length;

          for (let index = start; index < max; index++) {
            newData.dripTasks.pop();
          }
          setCurrentData(newData)

        }
      }
      }>
        <SliderTrack>
          <Box position='relative' right={10} />
          <SliderFilledTrack bg='blue.300' />
        </SliderTrack>
        <SliderThumb boxSize={6} bgColor='blue.500' />

      </Slider>


      <Stat>

        <StatLabel>ปริมาณน้ำที่ใช้:</StatLabel>
        <StatNumber>{water} ml.</StatNumber>
        {ice > 0 && <>
          <StatLabel>ปริมาณน้ำแข็งที่ใช้:</StatLabel>
          <StatNumber>{ice} g.</StatNumber>
        </>
        }
        <StatLabel color='gray.500'>สูญเสียน้ำโดยประมาณ {currentData.coffee * 2.0} ml.</StatLabel>
        <StatLabel>น้ำกาแฟที่จะได้:</StatLabel>

        {/* add water if cold drip */}
        <StatNumber color='blue.400'>{Math.round((water + ice + diffWater - (currentData.coffee * 2.0)) * 100) / 100} ml.</StatNumber>
        {diffWater > 0 && <StatLabel color='violet'>น้ำเกิน {diffWater} ml.</StatLabel>}
        {diffWater < 0 && <StatLabel color='red'>น้ำขาด {Math.abs(diffWater)} ml.</StatLabel>}
        <StatLabel>ใช้เวลาในการดริป:</StatLabel>
        <StatNumber color='blue.400'>{dripTime} วินาที</StatNumber>


      </Stat>



      <TableContainer>

        <Table>
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>รอบที่</Th>
              <Th>เวลา/วินาที</Th>
              <Th>น้ำ/มิลลิลิตร</Th>
            </Tr>
          </Thead>
          <Tbody>

            {
              currentData.dripTasks.map((value, index) => (
                <Tr key={index}>
                  <Td>{value.id}</Td>
                  <Td>
                    <NumberInput step={5} value={value.time} min={30} max={50}
                      onChange={(s, n) => {

                        const newData = { ...currentData };
                        newData.dripTasks[index].time = isNaN(n) ? 0 : n;
                        setCurrentData(newData);
                      }}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                  <Td>
                    <NumberInput step={1} value={value.water} min={20} max={100}
                      onChange={(s, n) => {

                        const newData = { ...currentData };
                        newData.dripTasks[index].water = isNaN(n) ? 0 : n;
                        setCurrentData(newData);
                      }}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </Td>
                </Tr>

              ))


            }

          </Tbody>

        </Table>
      </TableContainer>
      <Button colorScheme='twitter' onClick={() => {
        // setIsDripping(true);
        onOpen();
      }}>เริ่มดริปกาแฟ</Button>



      <DripingTime isOpen={isOpen} onClose={onClose} datas={currentData.dripTasks} />
    </Stack>
  )
}

export default App
