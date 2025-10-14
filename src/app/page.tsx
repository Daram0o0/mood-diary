'use client'
import Button from "@/commons/components/button";
import Input from "@/commons/components/input";
import Pagination from "@/commons/components/pagination";
import Searchbar from "@/commons/components/searchbar";
import Toggle from "@/commons/components/toggle";

export default function Home() {

  return ( 
    <div className="flex flex-row items-center justify-center gap-20">
      <div>
        <label>버튼: </label>
        <Button>버튼</Button>
      </div>
      <div>
        <label>인풋: </label>
        <Input/>
      </div>
      <div>
        <label>페이지네이션: </label>
        <Pagination currentPage={2} totalPages={10} onPageChange={()=>{}} />
      </div>
      <div>
        <label>서치바: </label>
        <Searchbar/>
      </div>
      <div>
        <label>토글: </label>
        <Toggle/>
      </div>
    </div>
  );
}
