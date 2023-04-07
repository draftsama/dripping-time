import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, HStack, Input, InputGroup, InputLeftAddon, InputRightAddon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Spacer, Stack, Stat, StatHelpText, StatLabel, StatNumber, Switch, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr, VStack, useDisclosure } from '@chakra-ui/react'
import DripingTime from './DripingTime'


const ratioData = [
  { value: 10, option: "1:10" },
  { value: 12, option: "1:12" },
  { value: 13, option: "1:13" },
  { value: 15, option: "1:15" },
  { value: 17, option: "1:17" },
  { value: 18, option: "1:18" },
  { value: 20, option: "1:20" }];

const DRIP_WATER_DEFAULT = 40;
const DRIP_TIMER_DEFAULT = 40;
const COFFEE_SEED_DEFAULT = 15;
const DRIP_LOOP_DEFAULT = 5;
const RATIO_DEFAULT_INDEX = 3;



export type DripProp = {
  id: number,
  water: number
  time: number
}
function App() {
  const [ratio, setRatio] = useState(ratioData[RATIO_DEFAULT_INDEX].value)
  const [water, setWater] = useState(0)
  const [dripLoop, setDripLoop] = useState(DRIP_LOOP_DEFAULT)
  const [dripList, setDripList] = useState<DripProp[]>([])
  const [coffeeSeed, setCoffeeSeed] = useState(COFFEE_SEED_DEFAULT)
  const [dripTime, setDripTime] = useState(0)
  const [diffWater, setDiffWater] = useState(0)

  const [isColdDrip, setIsColdDrip] = useState<boolean>(false)
  const [ice, setIce] = useState(0)
  const [tempreature, setSempreature] = useState(90)

  const [iceMelt, setIceMelt] = useState(0)


  const { isOpen, onOpen, onClose } = useDisclosure()







  useEffect(() => {

    let w = Math.round((coffeeSeed * ratio) * 100) / 100;

    //L = 334 J/g (ความคล้ายคลึงของน้ำแข็ง)
    //C = 4.18 J/g °C (ค่าความร้อนแหล่งเผาผลาญของน้ำ)
    const L = 334;
    const C = 4.18;

    const q1 = ice * L;
    const melt = Math.round(q1 / (C * tempreature))

    console.log(melt);

    let round = Math.round((w - melt) * 100) / 100

    setIceMelt(melt);

    setWater(round)
  }, [ratio, coffeeSeed, ice])

  useEffect(() => {
    //initialize
    var list: DripProp[] = []
    for (let index = 0; index < DRIP_LOOP_DEFAULT; index++) {
      list.push({ id: index + 1, water: DRIP_WATER_DEFAULT, time: DRIP_TIMER_DEFAULT })
    }

    setDripList(list);

    return () => {

    }
  }, [])


  useEffect(() => {
    // console.log(dripList);
    setDripTime(dripList.reduce((acc, list) => acc + list.time, 0))
    const dif = dripList.reduce((acc, list) => acc + list.water, 0) - water;
    setDiffWater(dif);

  }, [dripList, water])

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>จำนวนกาแฟ (g):</FormLabel>
        <NumberInput defaultValue={COFFEE_SEED_DEFAULT} min={10} onChange={(s, n) => {
          setCoffeeSeed(isNaN(n) ? 0 : n);
        }}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormLabel mt={2}>อัตราส่วน:</FormLabel>
        <Select placeholder='Select option' value={ratio} onChange={(event) => {
          setRatio(Number(event.target.value))
        }}>
          {
            ratioData.map((item) => (
              <option key={item.value} value={item.value}>{item.option}</option>
            ))
          }

        </Select>

        <FormLabel mt={2}>จำนวนน้ำแข็ง (g):</FormLabel>
        <NumberInput value={ice} min={0} step={50} onChange={(s, n) => {
          setIce(isNaN(n) ? 0 : n);
        }}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>

      </FormControl>




      {/* <Text>เมล็ดกาแฟ 1 g. ต่อน้ำ {ratio} ml.</Text> */}

      <FormLabel mt={2}>จำนวนรอบในการดริป: {dripLoop}</FormLabel>

      <Slider value={dripLoop} min={3} max={5} step={1} onChange={(value) => {
        setDripLoop(value);
        var list = [...dripList];
        if (value > dripLoop) {

          const start = dripLoop;
          const max = value;
          for (let index = start; index < max; index++) {

            list.push({ id: index + 1, water: DRIP_WATER_DEFAULT, time: DRIP_TIMER_DEFAULT });
          }

          setDripList(list);
        } else if (value < dripLoop) {

          const start = value;
          const max = dripLoop;

          for (let index = start; index < max; index++) {
            list.pop();
          }
          setDripList(list);

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
        <StatLabel color='gray.500'>สูญเสียน้ำโดยประมาณ {coffeeSeed * 2.0} ml.</StatLabel>
        <StatLabel>น้ำกาแฟที่จะได้:</StatLabel>
        {/* add water if cold drip */}
        <StatNumber color='blue.400'>{Math.round((water + iceMelt + diffWater - (coffeeSeed * 2.0)) * 100) / 100} ml.</StatNumber>
        <StatLabel>จำนวนรอบในการดริป:</StatLabel>
        <StatNumber color='blue.400'>{dripLoop} รอบ</StatNumber>
        <StatLabel>ใช้เวลาในการดริป:</StatLabel>
        <StatNumber color='blue.400'>{dripTime} วินาที</StatNumber>
        {diffWater > 0 && <StatLabel color='red.300'>น้ำเกินปริมาณ {diffWater} ml.</StatLabel>}
        {diffWater < 0 && <StatLabel color='red.300'>น้ำไม่ถึงปริมาณ {Math.abs(diffWater)} ml.</StatLabel>}

      </Stat>



      <TableContainer>
        <Table variant='simple'>
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              <Th>รอบที่</Th>
              <Th>เวลา/วินาที</Th>
              <Th>น้ำ/ml</Th>
            </Tr>
          </Thead>
          <Tbody>

            {dripList &&
              dripList.map((value, index) => (
                <Tr key={index}>
                  <Td>{value.id}</Td>
                  <Td>
                    <NumberInput step={5} value={value.time} min={30} max={50}
                      onChange={(s, n) => {

                        const newArray = [...dripList];
                        newArray[index].time = isNaN(n) ? DRIP_TIMER_DEFAULT : n;
                        setDripList(newArray);
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
                        const newArray = [...dripList];
                        let w = isNaN(n) ? DRIP_WATER_DEFAULT : n;
                        newArray[index].water = w;



                        setDripList(newArray);
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



      <DripingTime isOpen={isOpen} onClose={onClose} datas={dripList} />
    </Stack>
  )
}

export default App
