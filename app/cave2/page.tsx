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
import axios from 'axios';
import { Ban, Delete, RefreshCcw, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import useCave2Store from '@/src/Cave2Store';


export interface Cave2Props {
}

export default function Cave2 (props: Cave2Props) {

  const [balance, setBalance] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [operator, setOperator] = useState<string>('');

  const { orderdata } = useCave2Store();

  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for (const order of orderdata) {
        const codeResponse = await axios.get('/api/cave2/getCode', {
          params: {
            apiKey: apiKey,
            orderId: order.orderid,
          },
        });
        const newCode = codeResponse.data.data;
        const code    = newCode !== null && newCode !== 'STATUS_WAIT_CODE' ? newCode.split(':')[1] : '' ;
        // Update the code in Zustand store for the corresponding order ID
        useCave2Store.setState((state) => ({
          orderdata: state.orderdata.map((o) =>
            o.orderid === order.orderid && !o.code.find((c) => c.code === code) ? { ...o, code: [...o.code,{ code:code }] } : o
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

  const handleOperatorChange = (value: string) => {
    setOperator(value);
  }

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
        const response = await axios.post('/api/cave2', {
            apiKey,
            service,
            country,
            operator,
        });
        const accessnumber = response.data.data.split(':');
        const newOrderId = accessnumber[1];
        const newNumber = accessnumber[2];
        
        useCave2Store.setState((state)=>({
          orderdata: [
            ...state.orderdata,
            {
              orderid: newOrderId,
              number: newNumber,
              code: []
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
    const codeResponse = await axios.post('/api/cave2/getCode', {
      apiKey: apiKey,
      orderId: orderId,
      status: status
    }).then((res)=> {
        const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
        if (confirmDelete) {
          // Remove the order from Zustand store
          useCave2Store.setState((state) => ({
            orderdata: state.orderdata.filter((o) => o.orderid !== orderId),
          }));
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
                    <SelectItem value="tw">Twitter</SelectItem>
                    <SelectItem value="fb">Facebook</SelectItem>
                    <SelectItem value="pm">Aol</SelectItem>
                    <SelectItem value="linkedin">LinkedIN</SelectItem>
                    <SelectItem value="go">Gmail</SelectItem>
                    <SelectItem value="ig">Instagram</SelectItem>
                    <SelectItem value="ot">Others</SelectItem>
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
                  <SelectItem value="afghanistan">Afghanistan</SelectItem>
                  <SelectItem value="albania">Albania</SelectItem>
                  <SelectItem value="algeria">Algeria</SelectItem>
                  <SelectItem value="angola">Angola</SelectItem>
                  <SelectItem value="anguilla">Anguilla</SelectItem>
                  <SelectItem value="antiguaandbarbuda">Antigua and Barbuda</SelectItem>
                  <SelectItem value="argentina">Argentina</SelectItem>
                  <SelectItem value="armenia">Armenia</SelectItem>
                  <SelectItem value="aruba">Aruba</SelectItem>
                  <SelectItem value="australia">Australia</SelectItem>
                  <SelectItem value="austria">Austria</SelectItem>
                  <SelectItem value="azerbaijan">Azerbaijan</SelectItem>
                  <SelectItem value="bahamas">Bahamas</SelectItem>
                  <SelectItem value="bahrain">Bahrain</SelectItem>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="barbados">Barbados</SelectItem>
                  <SelectItem value="belarus">Belarus</SelectItem>
                  <SelectItem value="belgium">Belgium</SelectItem>
                  <SelectItem value="belize">Belize</SelectItem>
                  <SelectItem value="benin">Benin</SelectItem>
                  <SelectItem value="bhutane">Bhutan</SelectItem>
                  <SelectItem value="bih">Bosnia and Herzegovina</SelectItem>
                  <SelectItem value="bolivia">Bolivia</SelectItem>
                  <SelectItem value="botswana">Botswana</SelectItem>
                  <SelectItem value="brazil">Brazil</SelectItem>
                  <SelectItem value="bulgaria">Bulgaria</SelectItem>
                  <SelectItem value="burkinafaso">Burkina Faso</SelectItem>
                  <SelectItem value="burundi">Burundi</SelectItem>
                  <SelectItem value="cambodia">Cambodia</SelectItem>
                  <SelectItem value="cameroon">Cameroon</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="capeverde">Cape Verde</SelectItem>
                  <SelectItem value="caymanislands">Cayman Islands</SelectItem>
                  <SelectItem value="chad">Chad</SelectItem>
                  <SelectItem value="chile">Chile</SelectItem>
                  <SelectItem value="china">China</SelectItem>
                  <SelectItem value="colombia">Colombia</SelectItem>
                  <SelectItem value="comoros">Comoros</SelectItem>
                  <SelectItem value="congo">Congo</SelectItem>
                  <SelectItem value="costarica">Costa Rica</SelectItem>
                  <SelectItem value="croatia">Croatia</SelectItem>
                  <SelectItem value="cuba">Cuba</SelectItem>
                  <SelectItem value="cyprus">Cyprus</SelectItem>
                  <SelectItem value="czech">Czechia</SelectItem>
                  <SelectItem value="denmark">Denmark</SelectItem>
                  <SelectItem value="djibouti">Djibouti</SelectItem>
                  <SelectItem value="dominica">Dominica</SelectItem>
                  <SelectItem value="dominicana">Dominican Republic</SelectItem>
                  <SelectItem value="drcongo">Drcongo</SelectItem>
                  <SelectItem value="easttimor">East Timor</SelectItem>
                  <SelectItem value="ecuador">Ecuador</SelectItem>
                  <SelectItem value="egypt">Egypt</SelectItem>
                  <SelectItem value="england">England</SelectItem>
                  <SelectItem value="equatorialguinea">Equatorial Guinea</SelectItem>
                  <SelectItem value="eritrea">Eritrea</SelectItem>
                  <SelectItem value="estonia">Estonia</SelectItem>
                  <SelectItem value="ethiopia">Ethiopia</SelectItem>
                  <SelectItem value="finland">Finland</SelectItem>
                  <SelectItem value="france">France</SelectItem>
                  <SelectItem value="frenchguiana">French Guiana</SelectItem>
                  <SelectItem value="gabon">Gabon</SelectItem>
                  <SelectItem value="gambia">Gambia</SelectItem>
                  <SelectItem value="georgia">Georgia</SelectItem>
                  <SelectItem value="germany">Germany</SelectItem>
                  <SelectItem value="ghana">Ghana</SelectItem>
                  <SelectItem value="greece">Greece</SelectItem>
                  <SelectItem value="grenada">Grenada</SelectItem>
                  <SelectItem value="guadeloupe">Guadeloupe</SelectItem>
                  <SelectItem value="guatemala">Guatemala</SelectItem>
                  <SelectItem value="guinea">Guinea</SelectItem>
                  <SelectItem value="guineabissau">Guinea-Bissau</SelectItem>
                  <SelectItem value="guyana">Guyana</SelectItem>
                  <SelectItem value="haiti">Haiti</SelectItem>
                  <SelectItem value="honduras">Honduras</SelectItem>
                  <SelectItem value="hongkong">Hong Kong</SelectItem>
                  <SelectItem value="hungary">Hungary</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="indonesia">Indonesia</SelectItem>
                  <SelectItem value="iran">Iran</SelectItem>
                  <SelectItem value="iraq">Iraq</SelectItem>
                  <SelectItem value="ireland">Ireland</SelectItem>
                  <SelectItem value="israel">Israel</SelectItem>
                  <SelectItem value="italy">Italy</SelectItem>
                  <SelectItem value="ivorycoast">Ivory Coast</SelectItem>
                  <SelectItem value="jamaica">Jamaica</SelectItem>
                  <SelectItem value="japan">Japan</SelectItem>
                  <SelectItem value="jordan">Jordan</SelectItem>
                  <SelectItem value="kazakhstan">Kazakhstan</SelectItem>
                  <SelectItem value="kenya">Kenya</SelectItem>
                  <SelectItem value="kuwait">Kuwait</SelectItem>
                  <SelectItem value="kyrgyzstan">Kyrgyzstan</SelectItem>
                  <SelectItem value="laos">Laos</SelectItem>
                  <SelectItem value="latvia">Latvia</SelectItem>
                  <SelectItem value="lesotho">Lesotho</SelectItem>
                  <SelectItem value="liberia">Liberia</SelectItem>
                  <SelectItem value="libya">Libya</SelectItem>
                  <SelectItem value="lithuania">Lithuania</SelectItem>
                  <SelectItem value="luxembourg">Luxembourg</SelectItem>
                  <SelectItem value="macau">Macau</SelectItem>
                  <SelectItem value="madagascar">Madagascar</SelectItem>
                  <SelectItem value="malawi">Malawi</SelectItem>
                  <SelectItem value="malaysia">Malaysia</SelectItem>
                  <SelectItem value="maldives">Maldives</SelectItem>
                  <SelectItem value="mali">Mali</SelectItem>
                  <SelectItem value="mauritania">Mauritania</SelectItem>
                  <SelectItem value="mauritius">Mauritius</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="moldova">Moldova</SelectItem>
                  <SelectItem value="mongolia">Mongolia</SelectItem>
                  <SelectItem value="montenegro">Montenegro</SelectItem>
                  <SelectItem value="montserrat">Montserrat</SelectItem>
                  <SelectItem value="morocco">Morocco</SelectItem>
                  <SelectItem value="mozambique">Mozambique</SelectItem>
                  <SelectItem value="myanmar">Myanmar</SelectItem>
                  <SelectItem value="namibia">Namibia</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="netherlands">Netherlands</SelectItem>
                  <SelectItem value="newcaledonia">New Caledonia</SelectItem>
                  <SelectItem value="newzealand">New Zealand</SelectItem>
                  <SelectItem value="nicaragua">Nicaragua</SelectItem>
                  <SelectItem value="niger">Niger</SelectItem>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="northmacedonia">North Macedonia</SelectItem>
                  <SelectItem value="norway">Norway</SelectItem>
                  <SelectItem value="oman">Oman</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                  <SelectItem value="panama">Panama</SelectItem>
                  <SelectItem value="papuanewguinea">Papua New Guinea</SelectItem>
                  <SelectItem value="paraguay">Paraguay</SelectItem>
                  <SelectItem value="peru">Peru</SelectItem>
                  <SelectItem value="philippines">Philippines</SelectItem>
                  <SelectItem value="poland">Poland</SelectItem>
                  <SelectItem value="portugal">Portugal</SelectItem>
                  <SelectItem value="puertorico">Puertorico</SelectItem>
                  <SelectItem value="qatar">Qatar</SelectItem>
                  <SelectItem value="reunion">Reunion</SelectItem>
                  <SelectItem value="romania">Romania</SelectItem>
                  <SelectItem value="romania_voice">Romania_voice</SelectItem>
                  <SelectItem value="russia">Russia</SelectItem>
                  <SelectItem value="rwanda">Rwanda</SelectItem>
                  <SelectItem value="saintkittsandnevis">Saint Kitts and Nevis</SelectItem>
                  <SelectItem value="saintlucia">Saint Lucia</SelectItem>
                  <SelectItem value="saintvincentandgrenadines">Saint Vincent and the Grenadines</SelectItem>
                  <SelectItem value="salvador">Salvador</SelectItem>
                  <SelectItem value="samoa">Samoa</SelectItem>
                  <SelectItem value="saotomeandprincipe">Sao Tome and Principe</SelectItem>
                  <SelectItem value="saudiarabia">Saudi Arabia</SelectItem>
                  <SelectItem value="senegal">Senegal</SelectItem>
                  <SelectItem value="serbia">Serbia</SelectItem>
                  <SelectItem value="seychelles">Republic of Seychelles</SelectItem>
                  <SelectItem value="sierraleone">Sierra Leone</SelectItem>
                  <SelectItem value="singapore">Singapore</SelectItem>
                  <SelectItem value="slovakia">Slovakia</SelectItem>
                  <SelectItem value="slovenia">Slovenia</SelectItem>
                  <SelectItem value="solomonislands">Solomon Islands</SelectItem>
                  <SelectItem value="somalia">Somalia</SelectItem>
                  <SelectItem value="southafrica">South Africa</SelectItem>
                  <SelectItem value="southkorea">South Korea</SelectItem>
                  <SelectItem value="southsudan">Southsudan</SelectItem>
                  <SelectItem value="spain">Spain</SelectItem>
                  <SelectItem value="srilanka">Sri Lanka</SelectItem>
                  <SelectItem value="sudan">Sudan</SelectItem>
                  <SelectItem value="suriname">Suriname</SelectItem>
                  <SelectItem value="swaziland">Swaziland</SelectItem>
                  <SelectItem value="sweden">Sweden</SelectItem>
                  <SelectItem value="switzerland">Switzerland</SelectItem>
                  <SelectItem value="syria">Syria</SelectItem>
                  <SelectItem value="taiwan">Taiwan</SelectItem>
                  <SelectItem value="tajikistan">Tajikistan</SelectItem>
                  <SelectItem value="tanzania">Tanzania</SelectItem>
                  <SelectItem value="thailand">Thailand</SelectItem>
                  <SelectItem value="tit">Trinidad and Tobago</SelectItem>
                  <SelectItem value="togo">Togo</SelectItem>
                  <SelectItem value="tonga">Tonga</SelectItem>
                  <SelectItem value="tunisia">Tunisia</SelectItem>
                  <SelectItem value="turkey">Turkey</SelectItem>
                  <SelectItem value="turkmenistan">Turkmenistan</SelectItem>
                  <SelectItem value="turksandcaicos">Turks and Caicos Island</SelectItem>
                  <SelectItem value="uae">Uae</SelectItem>
                  <SelectItem value="uganda">Uganda</SelectItem>
                  <SelectItem value="ukraine">Ukraine</SelectItem>
                  <SelectItem value="uruguay">Uruguay</SelectItem>
                  <SelectItem value="usa">USA</SelectItem>
                  <SelectItem value="uzbekistan">Uzbekistan</SelectItem>
                  <SelectItem value="venezuela">Venezuela</SelectItem>
                  <SelectItem value="vietnam">Vietnam</SelectItem>
                  <SelectItem value="virginislands">British Virgin Islands</SelectItem>
                  <SelectItem value="yemen">Yemen</SelectItem>
                  <SelectItem value="zambia">Zambia</SelectItem>
                  <SelectItem value="zimbabwe">Zimbabwe</SelectItem>

                </SelectGroup>
            </SelectContent>
        </Select>
        <Select onValueChange={handleOperatorChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Operator" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                  <SelectLabel>Operator</SelectLabel>
                  <SelectItem value="any">any</SelectItem>
                  <SelectItem value="019">019</SelectItem>
                  <SelectItem value="Virt10">activ</SelectItem>
                  <SelectItem value="Virt11">altel</SelectItem>
                  <SelectItem value="Virt1">beeline</SelectItem>
                  <SelectItem value="Claro">claro</SelectItem>
                  <SelectItem value="Ee">ee</SelectItem>
                  <SelectItem value="Globe">globe</SelectItem>
                  <SelectItem value="Itelecom">itelecom</SelectItem>
                  <SelectItem value="Virt12">kcell</SelectItem>
                  <SelectItem value="Kyivstar">kyivstar</SelectItem>
                  <SelectItem value="Lebara">lebara</SelectItem>
                  <SelectItem value="Virt14">lycamobile</SelectItem>
                  <SelectItem value="Matrix">matrix</SelectItem>
                  <SelectItem value="Virt3">megafon</SelectItem>
                  <SelectItem value="Movistar">movistar</SelectItem>
                  <SelectItem value="Virt2">mts</SelectItem>
                  <SelectItem value="O2">o2</SelectItem>
                  <SelectItem value="Orange">orange</SelectItem>
                  <SelectItem value="Partner">partner</SelectItem>
                  <SelectItem value="Pildyk">pildyk</SelectItem>
                  <SelectItem value="Play">play</SelectItem>
                  <SelectItem value="Range1">range1</SelectItem>
                  <SelectItem value="Redbull">redbull</SelectItem>
                  <SelectItem value="Redbullmobile">redbullmobile</SelectItem>
                  <SelectItem value="Virt5">rostelecom</SelectItem>
                  <SelectItem value="Smart">smart</SelectItem>
                  <SelectItem value="Virt8">sun</SelectItem>
                  <SelectItem value="Syma">syma</SelectItem>
                  <SelectItem value="Virt4">tele2</SelectItem>
                  <SelectItem value="Three">three</SelectItem>
                  <SelectItem value="Tigo">tigo</SelectItem>
                  <SelectItem value="Tmobile">tmobile</SelectItem>
                  <SelectItem value="Virt9">tnt</SelectItem>
                  <SelectItem value="Virginmobile">virginmobile</SelectItem>
                  <SelectItem value="Virtual1">virtual1</SelectItem>
                  <SelectItem value="Virtual2">virtual2</SelectItem>
                  <SelectItem value="Virtual3">virtual3</SelectItem>
                  <SelectItem value="Virtual4">virtual4</SelectItem>
                  <SelectItem value="Virtual5">virtual5</SelectItem>
                  <SelectItem value="Virtual6">virtual6</SelectItem>
                  <SelectItem value="Virtual7">virtual7</SelectItem>
                  <SelectItem value="Virtual8">virtual8</SelectItem>
                  <SelectItem value="Virtual9">virtual9</SelectItem>
                  <SelectItem value="Virtual10">virtual10</SelectItem>
                  <SelectItem value="Virtual11">virtual11</SelectItem>
                  <SelectItem value="Virtual12">virtual12</SelectItem>
                  <SelectItem value="Virtual15">virtual15</SelectItem>
                  <SelectItem value="Virtual16">virtual16</SelectItem>
                  <SelectItem value="Virtual17">virtual17</SelectItem>
                  <SelectItem value="Virtual18">virtual18</SelectItem>
                  <SelectItem value="Virtual19">virtual19</SelectItem>
                  <SelectItem value="Virtual20">virtual20</SelectItem>
                  <SelectItem value="Virtual21">virtual21</SelectItem>
                  <SelectItem value="Virtual22">virtual22</SelectItem>
                  <SelectItem value="Virtual23">virtual23</SelectItem>
                  <SelectItem value="Virtual24">virtual24</SelectItem>
                  <SelectItem value="Virtual25">virtual25</SelectItem>
                  <SelectItem value="Virtual26">virtual26</SelectItem>
                  <SelectItem value="Virtual27">virtual27</SelectItem>
                  <SelectItem value="Virtual28">virtual28</SelectItem>
                  <SelectItem value="Virtual29">virtual29</SelectItem>
                  <SelectItem value="Virtual30">virtual30</SelectItem>
                  <SelectItem value="Virtual31">virtual31</SelectItem>
                  <SelectItem value="Virtual32">virtual32</SelectItem>
                  <SelectItem value="Virtual33">virtual33</SelectItem>
                  <SelectItem value="Virtual34">virtual34</SelectItem>
                  <SelectItem value="Virtual35">virtual35</SelectItem>
                  <SelectItem value="Virtual36">virtual36</SelectItem>
                  <SelectItem value="Virtual37">virtual37</SelectItem>
                  <SelectItem value="Virtual38">virtual38</SelectItem>
                  <SelectItem value="Virtual39 (voice from bot)">virtual39</SelectItem>
                  <SelectItem value="Virtual40">virtual40</SelectItem>
                  <SelectItem value="Virtual41">virtual41</SelectItem>
                  <SelectItem value="Virtual42">virtual42</SelectItem>
                  <SelectItem value="Virtual47">virtual47</SelectItem>
                  <SelectItem value="Virtual49">virtual49</SelectItem>
                  <SelectItem value="Virtual50">virtual50</SelectItem>
                  <SelectItem value="Virtual51">virtual51</SelectItem>
                  <SelectItem value="Virtual52">virtual52</SelectItem>
                  <SelectItem value="Virtual53">virtual53</SelectItem>
                  <SelectItem value="Virt15">vodafone</SelectItem>
                  <SelectItem value="Virt16">yota</SelectItem>
                  <SelectItem value="Zz">zz</SelectItem>
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
                <TableCell className='px-6 py-4 whitespace-nowrap'>{order.code.length > 0 ? order.code.join("\n") : ''}</TableCell>
                <TableCell className='px-6 py-4 whitespace-nowrap space-x-4'>
                  <Button onClick={()=>handleNumberClick(order.orderid,'ban')} title='Ban'><Ban /></Button>
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