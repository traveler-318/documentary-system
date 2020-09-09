
export function setListData(data) {
    return {
        list:data.records,
        pagination:{
          total:data.total,
          current:data.current,
          pageSize:data.size,
        }
    }
}