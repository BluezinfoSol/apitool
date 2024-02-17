import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as React from 'react';

export interface ICave2Props {
}

export default function Cave2 (props: ICave2Props) {
  
  return (
    <div>
      <div className='w-full flex space-x-3'>
        <Input
          type='text'
          name='apikey'
          id='apikey'
        />
        <Button>Get Number</Button>
      </div>
    </div>
  );
}
