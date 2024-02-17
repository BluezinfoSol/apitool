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
    });
    if(status=='cancel') {

      const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
      if (confirmDelete) {
        // Remove the order from Zustand store
        useCaveStore.setState((state) => ({
          orderdata: state.orderdata.filter((o) => o.orderid !== orderId),
        }));
      }

    } else {
      const newCode = codeResponse.data.data;
      // Update the code in Zustand store for the corresponding order ID
      useCaveStore.setState((state) => ({
        orderdata: state.orderdata.map((o) =>
          o.orderid === orderId ? { ...o, code: newCode } : o
        ),
      }));
    }
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
                <SelectItem value="0">Russia </SelectItem>
                <SelectItem value="32">Romania </SelectItem>
                <SelectItem value="1">Ukraine</SelectItem>
                <SelectItem value="2">Kazakhstan</SelectItem>
                <SelectItem value="3">China</SelectItem>
                <SelectItem value="5">Myanmar</SelectItem>
                <SelectItem value="26">Haiti</SelectItem>
                <SelectItem value="38">Ghana</SelectItem>
                <SelectItem value="15">Poland</SelectItem>
                <SelectItem value="28">Gambia</SelectItem>
                <SelectItem value="42">Chad</SelectItem>
                <SelectItem value="11">Kyrgyzstan</SelectItem>
                <SelectItem value="27">ivorycoast</SelectItem>
                <SelectItem value="34">estonia</SelectItem>
                <SelectItem value="6">indonesia</SelectItem>
                <SelectItem value="73">Brazil</SelectItem>
                <SelectItem value="25">Laos</SelectItem>
                <SelectItem value="49">Latvia</SelectItem>
                <SelectItem value="36">Canada</SelectItem>
                <SelectItem value="16">England</SelectItem>
                <SelectItem value="52">Thailand</SelectItem>
                <SelectItem value="7">Malaysia</SelectItem>
                <SelectItem value="22">India</SelectItem>
                <SelectItem value="78">France</SelectItem>
                <SelectItem value="43">Germany</SelectItem>
                <SelectItem value="33">Colombia</SelectItem>
                <SelectItem value="44">Lithuania</SelectItem>
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