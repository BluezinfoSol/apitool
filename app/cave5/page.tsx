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
import useCave5Store from '@/src/Cave5Store';


export interface Cave5Props {
}

export default function Cave5 (props: Cave5Props) {

  const [balance, setBalance] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [operator, setOperator] = useState<string>('');

  const { orderdata } = useCave5Store();

  const { toast } = useToast();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      for (const order of orderdata) {
        const codeResponse = await axios.get('/api/cave5/getCode', {
          params: {
            apiKey: apiKey,
            orderId: order.orderid,
          },
        });
        const newCode = codeResponse.data.data.data;
        if(newCode!==null) {
          const code    = newCode.msg ;
          // Update the code in Zustand store for the corresponding order ID
          useCave5Store.setState((state) => ({
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
        const response = await axios.post('/api/cave5', {
            apiKey,
            service,
            country,
        });
        const result = response.data.data.data;
        if(!result.error) {
            useCave5Store.setState((state)=>({
            orderdata: [
                ...state.orderdata,
                {
                    orderid: result.order_id,
                    number: result.phone,
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
    const codeResponse = await axios.post('/api/cave5/getCode', {
      apiKey: apiKey,
      orderId: orderId,
      status: status
    }).then((res)=> {
      if(status=='cancel') {

        const confirmDelete = window.confirm('Are you sure you want to cancel this order?');
        if (confirmDelete) {
          // Remove the order from Zustand store
          useCave5Store.setState((state) => ({
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
                    <SelectItem value="mb">Yahoo</SelectItem>
                    <SelectItem value="mm">Microsoft</SelectItem>
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
                    <SelectItem value="ru">Russia</SelectItem>
                    <SelectItem value="ukr">Ukraine</SelectItem>
                    <SelectItem value="england">England</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="kazakhstan">Kazakhstan</SelectItem>
                    <SelectItem value="usavirt">USA (Virtual)</SelectItem>
                    <SelectItem value="brazil">Brazil</SelectItem>
                    <SelectItem value="estonia">Estonia</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                    <SelectItem value="indonesia">Indonesia</SelectItem>
                    <SelectItem value="kyrgyzstan">Kyrgyzstan</SelectItem>
                    <SelectItem value="laos">Laos</SelectItem>
                    <SelectItem value="lithuania">Lithuania</SelectItem>
                    <SelectItem value="netherlands">Netherlands</SelectItem>
                    <SelectItem value="poland">Poland</SelectItem>
                    <SelectItem value="romania">Romania</SelectItem>
                    <SelectItem value="sweden">Sweden</SelectItem>
                    <SelectItem value="malaiziia">Malaysia</SelectItem>
                    <SelectItem value="tailand">Thailand</SelectItem>
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