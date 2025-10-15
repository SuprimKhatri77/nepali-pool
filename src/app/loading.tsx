import { Spinner } from "@/components/ui/spinner";

const loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner />
    </div>
  );
};

export default loading;
