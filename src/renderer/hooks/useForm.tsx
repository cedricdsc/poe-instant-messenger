import { useState } from 'react';

// useForm functional componen
export default function useForm(callback: any, initialState = {}) {
  const [values, setValues] = useState(initialState);

  // onChange
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // onSubmit
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    callback(values); // triggering the callback
  };

  // onKeyDown
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
      callback(values);
      event.currentTarget.value = '';
    }
  };

  // return values
  return {
    onChange,
    onSubmit,
    values,
    handleKeyDown,
  };
}
