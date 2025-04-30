"use client";

import { useEffect } from "react";
import type { FormStatus } from "react-dom";
import { useFormState, useFormStatus } from "react-dom";

import { FormState } from "@/schemas/form_state";

type Props = {
  action: React.ServerAction;
  formAction?: (
    data: FormData,
    action: (payload: FormData) => void,
  ) => Promise<void>;
  onSuccess?: () => void;
  render: (props: { status: FormStatus; state?: FormState }) => React.ReactNode;
};
export const FormWithServerAction: React.FC<Props> = (props) => {
  const [state, action] = useFormState(props.action, undefined);
  const { formAction, onSuccess, render } = props;

  useEffect(() => {
    if (state?.success === true) {
      onSuccess && onSuccess();
    }
  }, [state, onSuccess]);

  return (
    <form
      action={async (data) => {
        formAction ? await formAction(data, action) : action(data);
      }}
    >
      <FormBody render={(status) => render({ state, status })} />
    </form>
  );
};

type FormBodyProps = {
  render: (status: FormStatus) => React.ReactNode;
};
const FormBody: React.FC<FormBodyProps> = ({ render }) => {
  const status = useFormStatus();

  return render(status);
};
