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
import { Delete, RefreshCcw, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"
import useCave3Store from '@/src/Cave3Store';


export interface Cave3Props {
}

export default function Cave3 (props: Cave3Props) {

  const [balance, setBalance] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [operator, setOperator] = useState<string>('');

  const { orderdata } = useCave3Store();

  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for (const order of orderdata) {
        const codeResponse = await axios.get('/api/cave3/getCode', {
          params: {
            apiKey: apiKey,
            orderId: order.orderid,
          },
        });
        const newCode = codeResponse.data.data;
        const code    = newCode.smsCode ;
        // Update the code in Zustand store for the corresponding order ID
        useCave3Store.setState((state) => ({
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
        const response = await axios.post('/api/cave3', {
            apiKey,
            service,
            country,
            operator,
        });
        const result = response.data.data;
        if(!result.error) {
            useCave3Store.setState((state)=>({
            orderdata: [
                ...state.orderdata,
                {
                    orderid: result.idNum,
                    number: result.tel,
                    code: []
                }
            ]
            }));
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            })
        }
    } catch (error) {
        console.error('Error fetching balance:', error);
        // Handle errors here
    }
  };

  const handleNumberClick = async (orderId: string, status: string) => {
    const codeResponse = await axios.post('/api/cave3/getCode', {
      apiKey: apiKey,
      orderId: orderId,
      status: status
    }).then((res)=> {
      if(status=='cancel') {

        const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
        if (confirmDelete) {
          // Remove the order from Zustand store
          useCave3Store.setState((state) => ({
            orderdata: state.orderdata.filter((o) => o.orderid !== orderId),
          }));
        }
  
      } else {
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
                    <SelectItem value="yh">Yahoo</SelectItem>
                    <SelectItem value="gl">Gmail</SelectItem>
                    <SelectItem value="ms">Microsoft</SelectItem>
                    <SelectItem value="ao">Aol</SelectItem>
                    <SelectItem value="fb">Facebook</SelectItem>
                    <SelectItem value="ig">Instagram</SelectItem>
                    <SelectItem value="tw">Twitter</SelectItem>
                    <SelectItem value="rf">Rediffmail</SelectItem>

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
                    <SelectItem value="tj">Tajikistan</SelectItem>
                    <SelectItem value="zw">Zimbabwe</SelectItem>
                    <SelectItem value="az">Azerbaijan</SelectItem>
                    <SelectItem value="tz">Tanzania</SelectItem>
                    <SelectItem value="usv">United States Virtual</SelectItem>
                    <SelectItem value="gt">Guatemala</SelectItem>
                    <SelectItem value="sk">Slovakia</SelectItem>
                    <SelectItem value="eg">Egypt</SelectItem>
                    <SelectItem value="cy">Cyprus</SelectItem>
                    <SelectItem value="xk">Kosovo</SelectItem>
                    <SelectItem value="mw">Malawi</SelectItem>
                    <SelectItem value="tl">Timor-Leste</SelectItem>
                    <SelectItem value="lk">Sri Lanka</SelectItem>
                    <SelectItem value="mm">Myanmar</SelectItem>
                    <SelectItem value="om">Oman</SelectItem>
                    <SelectItem value="hr">Croatia</SelectItem>
                    <SelectItem value="pk">Pakistan</SelectItem>
                    <SelectItem value="pe">Peru</SelectItem>
                    <SelectItem value="ps">Palestine</SelectItem>
                    <SelectItem value="kg">Kyrgyzstan</SelectItem>
                    <SelectItem value="nu">Niue</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                    <SelectItem value="gr">Greece</SelectItem>
                    <SelectItem value="sl">Sierra Leone</SelectItem>
                    <SelectItem value="il">Israel</SelectItem>
                    <SelectItem value="uz">Uzbekistan</SelectItem>
                    <SelectItem value="ar">Argentina</SelectItem>
                    <SelectItem value="at">Austria</SelectItem>
                    <SelectItem value="bd">Bangladesh</SelectItem>
                    <SelectItem value="cz">Czech Republic</SelectItem>
                    <SelectItem value="za">South Africa</SelectItem>
                    <SelectItem value="ao">Angola</SelectItem>
                    <SelectItem value="cav">Canada Virtual</SelectItem>
                    <SelectItem value="si">Slovenia</SelectItem>
                    <SelectItem value="ua">Ukraine</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="mz">Mozambique</SelectItem>
                    <SelectItem value="vn">Vietnam</SelectItem>
                    <SelectItem value="es">Spain</SelectItem>
                    <SelectItem value="nl">Netherlands</SelectItem>
                    <SelectItem value="dk">Denmark</SelectItem>
                    <SelectItem value="ee">Estonia</SelectItem>
                    <SelectItem value="gb">United Kingdom</SelectItem>
                    <SelectItem value="kz">Kazakhstan</SelectItem>
                    <SelectItem value="ro">Romania</SelectItem>
                    <SelectItem value="bg">Bulgaria</SelectItem>
                    <SelectItem value="mx">Mexico</SelectItem>
                    <SelectItem value="hk">Hong Kong</SelectItem>
                    <SelectItem value="id">Indonesia</SelectItem>
                    <SelectItem value="lv">Latvia</SelectItem>
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
                    <SelectItem value="ee">ee</SelectItem>
                    <SelectItem value="lycamobile">lycamobile</SelectItem>
                    <SelectItem value="o2">o2</SelectItem>
                    <SelectItem value="orange">orange</SelectItem>
                    <SelectItem value="three">three</SelectItem>
                    <SelectItem value="tmobile">tmobile</SelectItem>
                    <SelectItem value="vodafone">vodafone</SelectItem>
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
                <TableCell className='px-6 py-4 whitespace-nowrap'>{order.code.length > 0 ? order.code.map(item=>item.code).join("\n") : ''}</TableCell>
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