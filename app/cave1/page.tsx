"use client";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"  
import useCaveStore from '@/src/Store';
import axios from 'axios';
import { Delete, RefreshCcw, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"


export interface Cave1Props {
}

export default function Cave1 (props: Cave1Props) {

  const [balance, setBalance] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  const { orderdata } = useCaveStore();

  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for (const order of orderdata) {
        const codeResponse = await axios.get('/api/cave1/getCode', {
          params: {
            apiKey: apiKey,
            orderId: order.orderid,
          },
        });
        const newCode = codeResponse.data.data;
        // Update the code in Zustand store for the corresponding order ID
        useCaveStore.setState((state) => ({
          orderdata: state.orderdata.map((o) =>
            o.orderid === order.orderid ? { ...o, code: newCode } : o
          ),
        }));
      }
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [orderdata]);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleServiceChange = (value: string) => {
    setService(value);
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const handleGetNumberClick = async () => {
    try {
        if(apiKey===null || apiKey==="" || apiKey===undefined) {
          toast({
            variant: "destructive",
            title: "Please enter the API Key",
            description: "",
          })
          return false;
        }
        const response = await axios.post('/api/cave1', {
            apiKey,
            service,
            country,
        });
        const accessnumber = response.data.data.split(':');
        const newOrderId = accessnumber[1];
        const newNumber = accessnumber[2];
        
        useCaveStore.setState((state)=>({
          orderdata: [
            ...state.orderdata,
            {
              orderid: newOrderId,
              number: newNumber,
              code: ''
            }
          ]
        }));
        // Assuming the API response contains the balance, update the state
        //setBalance(response.data.balance);
    } catch (error) {
        console.error('Error fetching balance:', error);
        // Handle errors here
    }
  };

  const handleNumberClick = async (orderId: string, status: string) => {
    const codeResponse = await axios.post('/api/cave1/getCode', {
      apiKey: apiKey,
      orderId: orderId,
      status: status
    }).then((res)=> {
      if(status=='cancel') {

        const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
        if (confirmDelete) {
          // Remove the order from Zustand store
          useCaveStore.setState((state) => ({
            orderdata: state.orderdata.filter((o) => o.orderid !== orderId),
          }));
        }
  
      } else {
        const newCode = '';
        // Update the code in Zustand store for the corresponding order ID
        useCaveStore.setState((state) => ({
          orderdata: state.orderdata.map((o) =>
            o.orderid === orderId ? { ...o, code: newCode } : o
          ),
        }));
        toast({
          variant: "default",
          title: "One More Code Activated",
          description: "",
        })
      }
    });
    
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (orderdata.length > 0) {
      const confirmationMessage = 'You have unsaved changes. Are you sure you want to leave?';
      (event || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [orderdata]);

  return (
    <div>
      <div className='w-full flex space-x-3'>
        
        <Input
          type='text'
          name='apikey'
          id='apikey'
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder={'Enter API Key'}
        />
        <Select onValueChange={handleServiceChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Service</SelectLabel>
                <SelectItem value="mb">Yahoo</SelectItem>
                <SelectItem value="mm">Microsoft</SelectItem>
                <SelectItem value="ig">Instagram</SelectItem>
                <SelectItem value="fb">Facebook</SelectItem>
                <SelectItem value="go">Google</SelectItem>
                <SelectItem value="tw">twitter</SelectItem>
                <SelectItem value="pm">AOL</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Country</SelectLabel>
                <SelectItem value="0">Russia</SelectItem>
                <SelectItem value="1">Ukraine</SelectItem>
                <SelectItem value="2">Kazakhstan</SelectItem>
                <SelectItem value="3">China</SelectItem>
                <SelectItem value="4">Philippines</SelectItem>
                <SelectItem value="5">Myanmar</SelectItem>
                <SelectItem value="6">Indonesia</SelectItem>
                <SelectItem value="7">Malaysia</SelectItem>
                <SelectItem value="8">Kenya</SelectItem>
                <SelectItem value="9">Tanzania</SelectItem>
                <SelectItem value="10">Vietnam</SelectItem>
                <SelectItem value="11">Kyrgyzstan</SelectItem>
                <SelectItem value="13">Israel</SelectItem>
                <SelectItem value="14">Hongkong</SelectItem>
                <SelectItem value="15">Poland</SelectItem>
                <SelectItem value="16">England</SelectItem>
                <SelectItem value="17">Madagascar</SelectItem>
                <SelectItem value="18">Dcongo</SelectItem>
                <SelectItem value="19">Nigeria</SelectItem>
                <SelectItem value="20">Macao</SelectItem>
                <SelectItem value="21">Egypt</SelectItem>
                <SelectItem value="22">India</SelectItem>
                <SelectItem value="23">Ireland</SelectItem>
                <SelectItem value="24">Cambodia</SelectItem>
                <SelectItem value="25">Laos</SelectItem>
                <SelectItem value="26">Haiti</SelectItem>
                <SelectItem value="27">Ivory</SelectItem>
                <SelectItem value="28">Gambia</SelectItem>
                <SelectItem value="29">Serbia</SelectItem>
                <SelectItem value="30">Yemen</SelectItem>
                <SelectItem value="31">South Africa</SelectItem>
                <SelectItem value="32">Romania</SelectItem>
                <SelectItem value="33">Colombia</SelectItem>
                <SelectItem value="34">Estonia</SelectItem>
                <SelectItem value="35">Azerbaijan</SelectItem>
                <SelectItem value="36">Canada</SelectItem>
                <SelectItem value="37">Morocco</SelectItem>
                <SelectItem value="38">Ghana</SelectItem>
                <SelectItem value="39">Argentina</SelectItem>
                <SelectItem value="40">Uzbekistan</SelectItem>
                <SelectItem value="41">Cameroon</SelectItem>
                <SelectItem value="42">Chad</SelectItem>
                <SelectItem value="43">Germany</SelectItem>
                <SelectItem value="44">Lithuania</SelectItem>
                <SelectItem value="45">Croatia</SelectItem>
                <SelectItem value="46">Sweden</SelectItem>
                <SelectItem value="47">Iraq</SelectItem>
                <SelectItem value="48">Netherlands</SelectItem>
                <SelectItem value="49">Latvia</SelectItem>
                <SelectItem value="50">Austria</SelectItem>
                <SelectItem value="51">Belarus</SelectItem>
                <SelectItem value="52">Thailand</SelectItem>
                <SelectItem value="53">Saudi Arabia</SelectItem>
                <SelectItem value="54">Mexico</SelectItem>
                <SelectItem value="55">Taiwan</SelectItem>
                <SelectItem value="56">Spain</SelectItem>
                <SelectItem value="57">Iran</SelectItem>
                <SelectItem value="58">Algeria</SelectItem>
                <SelectItem value="59">Slovenia</SelectItem>
                <SelectItem value="60">Bangladesh</SelectItem>
                <SelectItem value="61">Senegal</SelectItem>
                <SelectItem value="62">Turkey</SelectItem>
                <SelectItem value="63">Czech</SelectItem>
                <SelectItem value="64">Sri Lanka</SelectItem>
                <SelectItem value="65">Peru</SelectItem>
                <SelectItem value="66">Pakistan</SelectItem>
                <SelectItem value="67">New Zealand</SelectItem>
                <SelectItem value="68">Guinea</SelectItem>
                <SelectItem value="69">Mali</SelectItem>
                <SelectItem value="70">Venezuela</SelectItem>
                <SelectItem value="71">Ethiopia</SelectItem>
                <SelectItem value="72">Mongolia</SelectItem>
                <SelectItem value="73">Brazil</SelectItem>
                <SelectItem value="74">Afghanistan</SelectItem>
                <SelectItem value="75">Uganda</SelectItem>
                <SelectItem value="76">Angola</SelectItem>
                <SelectItem value="77">Cyprus</SelectItem>
                <SelectItem value="78">France</SelectItem>
                <SelectItem value="79">Papua</SelectItem>
                <SelectItem value="80">Mozambique</SelectItem>
                <SelectItem value="81">Nepal</SelectItem>
                <SelectItem value="82">Belgium</SelectItem>
                <SelectItem value="83">Bulgaria</SelectItem>
                <SelectItem value="84">Hungary</SelectItem>
                <SelectItem value="85">Moldova</SelectItem>
                <SelectItem value="86">Italy</SelectItem>
                <SelectItem value="87">Paraguay</SelectItem>
                <SelectItem value="88">Honduras</SelectItem>
                <SelectItem value="89">Tunisia</SelectItem>
                <SelectItem value="90">Nicaragua</SelectItem>
                <SelectItem value="91">Timor-Leste</SelectItem>
                <SelectItem value="92">Bolivia</SelectItem>
                <SelectItem value="93">Costa Rica</SelectItem>
                <SelectItem value="94">Guatemala</SelectItem>
                <SelectItem value="95">UAE</SelectItem>
                <SelectItem value="96">Zimbabwe</SelectItem>
                <SelectItem value="97">Puerto Rico</SelectItem>
                <SelectItem value="98">Sudan</SelectItem>
                <SelectItem value="99">Togo</SelectItem>
                <SelectItem value="100">Kuwait</SelectItem>
                <SelectItem value="101">El Salvador</SelectItem>
                <SelectItem value="102">Libya</SelectItem>
                <SelectItem value="103">Jamaica</SelectItem>
                <SelectItem value="104">Trinidad</SelectItem>
                <SelectItem value="105">Ecuador</SelectItem>
                <SelectItem value="106">Swaziland</SelectItem>
                <SelectItem value="107">Oman</SelectItem>
                <SelectItem value="108">Bosnia</SelectItem>
                <SelectItem value="109">Dominican</SelectItem>
                <SelectItem value="110">Syria</SelectItem>
                <SelectItem value="111">Qatar</SelectItem>
                <SelectItem value="112">Panama</SelectItem>
                <SelectItem value="113">Cuba</SelectItem>
                <SelectItem value="114">Mauritania</SelectItem>
                <SelectItem value="115">Sierra Leone</SelectItem>
                <SelectItem value="116">Jordan</SelectItem>
                <SelectItem value="117">Portugal</SelectItem>
                <SelectItem value="118">Barbados</SelectItem>
                <SelectItem value="119">Burundi</SelectItem>
                <SelectItem value="120">Benin</SelectItem>
                <SelectItem value="121">Brunei</SelectItem>
                <SelectItem value="122">Bahamas</SelectItem>
                <SelectItem value="123">Botswana</SelectItem>
                <SelectItem value="124">Belize</SelectItem>
                <SelectItem value="125">Central African Republic</SelectItem>
                <SelectItem value="126">Dominica</SelectItem>
                <SelectItem value="127">Grenada</SelectItem>
                <SelectItem value="128">Georgia</SelectItem>
                <SelectItem value="129">Greece</SelectItem>
                <SelectItem value="130">Guinea-Bissau</SelectItem>
                <SelectItem value="131">Guyana</SelectItem>
                <SelectItem value="132">Iceland</SelectItem>
                <SelectItem value="133">Comoros</SelectItem>
                <SelectItem value="134">Saint Kitts</SelectItem>
                <SelectItem value="135">Liberia</SelectItem>
                <SelectItem value="136">Lesotho</SelectItem>
                <SelectItem value="137">Malawi</SelectItem>
                <SelectItem value="138">Namibia</SelectItem>
                <SelectItem value="139">Niger</SelectItem>
                <SelectItem value="140">Rwanda</SelectItem>
                <SelectItem value="141">Slovakia</SelectItem>
                <SelectItem value="142">Suriname</SelectItem>
                <SelectItem value="143">Tajikistan</SelectItem>
                <SelectItem value="144">Monaco</SelectItem>
                <SelectItem value="145">Bahrain</SelectItem>
                <SelectItem value="146">Reunion</SelectItem>
                <SelectItem value="147">Zambia</SelectItem>
                <SelectItem value="148">Armenia</SelectItem>
                <SelectItem value="149">Somalia</SelectItem>
                <SelectItem value="150">Congo</SelectItem>
                <SelectItem value="151">Chile</SelectItem>
                <SelectItem value="152">Burkina Faso</SelectItem>
                <SelectItem value="153">Lebanon</SelectItem>
                <SelectItem value="154">Gabon</SelectItem>
                <SelectItem value="155">Albania</SelectItem>
                <SelectItem value="156">Uruguay</SelectItem>
                <SelectItem value="157">Mauritius</SelectItem>
                <SelectItem value="158">Bhutan</SelectItem>
                <SelectItem value="159">Maldives</SelectItem>
                <SelectItem value="160">Guadeloupe</SelectItem>
                <SelectItem value="161">Turkmenistan</SelectItem>
                <SelectItem value="162">French Guiana</SelectItem>
                <SelectItem value="163">Finland</SelectItem>
                <SelectItem value="164">Saint Lucia</SelectItem>
                <SelectItem value="165">Luxembourg</SelectItem>
                <SelectItem value="166">Saint Vincent and Grenadines</SelectItem>
                <SelectItem value="167">Equatorial Guinea</SelectItem>
                <SelectItem value="168">Djibouti</SelectItem>
                <SelectItem value="169">Antigua and Barbuda</SelectItem>
                <SelectItem value="170">Cayman Islands</SelectItem>
                <SelectItem value="171">Montenegro</SelectItem>
                <SelectItem value="172">Denmark</SelectItem>
                <SelectItem value="173">Switzerland</SelectItem>
                <SelectItem value="174">Norway</SelectItem>
                <SelectItem value="175">Australia</SelectItem>
                <SelectItem value="176">Eritrea</SelectItem>
                <SelectItem value="177">South Sudan</SelectItem>
                <SelectItem value="178">Sao Tome and Principe</SelectItem>
                <SelectItem value="179">Aruba</SelectItem>
                <SelectItem value="180">Montserrat</SelectItem>
                <SelectItem value="181">Anguilla</SelectItem>
                <SelectItem value="182">Japan</SelectItem>
                <SelectItem value="183">North Macedonia</SelectItem>
                <SelectItem value="184">Seychelles</SelectItem>
                <SelectItem value="185">New Caledonia</SelectItem>
                <SelectItem value="186">Cape Verde</SelectItem>
                <SelectItem value="187">USA Physical</SelectItem>
                <SelectItem value="188">Palestine</SelectItem>
                <SelectItem value="189">Fiji</SelectItem>
                <SelectItem value="196">Singapore</SelectItem>
                <SelectItem value="199">Malta</SelectItem>
                <SelectItem value="201">Gibraltar</SelectItem>
                <SelectItem value="203">Kosovo</SelectItem>
                <SelectItem value="204">Niue</SelectItem>

                </SelectGroup>
            </SelectContent>
        </Select>
        <Button onClick={handleGetNumberClick}>Get Number</Button>
      </div>
      <div className='mt-5'>
      <Table>
        <TableCaption>A list of your recent numbers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderdata.map((order) => (
              <TableRow key={order.orderid}>
                <TableCell className='px-6 py-4 whitespace-nowrap'>{order.orderid}</TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap'>{order.number}</TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap'>{order.code}</TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap space-x-4'>
                  <Button onClick={()=>handleNumberClick(order.orderid,'onemore')} title='One More'><RefreshCcw /></Button>
                  <Button onClick={()=>handleNumberClick(order.orderid,'cancel')} title='Cancel'><Trash /></Button>
                </TableCell>
              </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}