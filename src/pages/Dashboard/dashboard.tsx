import useFetch from "@/hooks/useFetch";

const Dashboard = () => {
  const { data } = useFetch("/services", ["services"]);

  console.log(data)

  return (
    <div>
      <h1>hello world!</h1>
    </div>
  );
};
export default Dashboard;
