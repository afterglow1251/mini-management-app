import React from "react";
import { useParams } from "react-router";
import { isValidId } from "../../utils/checkers.utils";
import { NotFound } from "../common/stubs/NotFound";

type WithValidIdProps = {
  children: (id: number) => React.ReactNode;
};

export function WithValidId({ children }: WithValidIdProps) {
  const { id } = useParams<{ id?: string }>();

  if (!id || !isValidId(id)) {
    return <NotFound />;
  }

  const numericId = Number(id);

  return <>{children(numericId)}</>;
}
