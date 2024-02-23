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
import useCave4Store from '@/src/Cave4Store';


export interface Cave4Props {
}

export default function Cave4 (props: Cave4Props) {

  const [balance, setBalance] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [operator, setOperator] = useState<string>('');

  const { orderdata } = useCave4Store();

  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for (const order of orderdata) {
        const codeResponse = await axios.get('/api/cave4/getCode', {
          params: {
            apiKey: apiKey,
            orderId: order.orderid,
          },
        });
        const newCode = codeResponse.data.data;
        if(newCode!==null) {
          const code    = newCode.small ;
          // Update the code in Zustand store for the corresponding order ID
          useCave4Store.setState((state) => ({
            orderdata: state.orderdata.map((o) =>
              o.orderid === order.orderid && !o.code.find((c) => c.code === code) ? { ...o, code: [...o.code,{ code:code }] } : o
            ),
          }));
        }
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
        const response = await axios.post('/api/cave4', {
            apiKey,
            service,
            country,
        });
        const result = response.data.data;
        if(!result.error) {
            useCave4Store.setState((state)=>({
            orderdata: [
                ...state.orderdata,
                {
                    orderid: result.id,
                    number: result.number,
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
    const codeResponse = await axios.post('/api/cave4/getCode', {
      apiKey: apiKey,
      orderId: orderId,
      status: status
    }).then((res)=> {
      if(status=='cancel') {

        const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
        if (confirmDelete) {
          // Remove the order from Zustand store
          useCave4Store.setState((state) => ({
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
                    <SelectItem value="12">Microsoft</SelectItem>
                    <SelectItem value="13">Facebook</SelectItem>
                    <SelectItem value="9">Gmail</SelectItem>
                    <SelectItem value="27">Aol</SelectItem>
                    <SelectItem value="24">Mail.ru</SelectItem>
                    <SelectItem value="11">Yahoo</SelectItem>
                    <SelectItem value="16">Instagram</SelectItem>
                    <SelectItem value="42">Snapchat</SelectItem>
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
                    <SelectItem value="RU">Russia</SelectItem>
                    <SelectItem value="UA">Ukraine</SelectItem>
                    <SelectItem value="KZ">Kazakhstan</SelectItem>
                    <SelectItem value="UZ">Uzbekistan</SelectItem>
                    <SelectItem value="SE">Sweden</SelectItem>
                    <SelectItem value="BL">Belarus</SelectItem>
                    <SelectItem value="GB">England</SelectItem>
                    <SelectItem value="MD">Moldova</SelectItem>
                    <SelectItem value="ID">Indonesia</SelectItem>
                    <SelectItem value="EE">Estonia</SelectItem>
                    <SelectItem value="DE">Germany</SelectItem>
                    <SelectItem value="RO">Romania</SelectItem>
                    <SelectItem value="CZ">Czech Republic</SelectItem>
                    <SelectItem value="US">USA</SelectItem>
                    <SelectItem value="PL">Poland</SelectItem>
                    <SelectItem value="LV">Latvia</SelectItem>
                    <SelectItem value="ES">Spain</SelectItem>
                    <SelectItem value="NL">Netherlands</SelectItem>
                    <SelectItem value="TH">Thailand</SelectItem>
                    <SelectItem value="PH">Philippines</SelectItem>
                    <SelectItem value="KE">Kenya</SelectItem>
                    <SelectItem value="PT">Portugal</SelectItem>
                    <SelectItem value="LT">Lithuania</SelectItem>
                    <SelectItem value="BA">Bosnia and Herzegovina</SelectItem>
                    <SelectItem value="GE">Georgia</SelectItem>
                    <SelectItem value="CO">Colombia</SelectItem>
                    <SelectItem value="KS">Kyrgyzstan</SelectItem>
                    <SelectItem value="MY">Malaysia</SelectItem>
                    <SelectItem value="BR">Brazil</SelectItem>
                    <SelectItem value="LA">Laos</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        {/* <Select onValueChange={handleOperatorChange}>
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
        </Select> */}
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