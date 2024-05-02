import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import Image from "next/image";
import Loader from "./Loader";
import Style from "./ProductList.module.css";

const QUERY = gql`
{
    products {
      data {
        id
        attributes {
          ProductName
          ProductFlavor
          Description
          Image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

function ProductCard({ data }) {
  console.log(data)
  console.log("Pooo")
  console.log(data.attributes.Description)
  if (!data || !data.attributes ) {
    return null; // Render nothing if data is incomplete or missing
  }
  console.log(data)
 

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="h-full bg-gray-50 rounded-2xl">
        <Image
          className="w-full rounded-2xl"
          height={300}
          width={300}
          src={`${process.env.STRAPI_URL || "http://127.0.0.1:1337"}${
            data.attributes.Image.data[0].attributes.url
          }`}
          alt=""
        />
        <div className="p-8">
        <Link
            style={{ color: '#808080' }} // Apply inline style for light color
            href={`/product/${data.id}`}
        >
          {data.attributes.ProductFlavor}<br />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={Style.highlight}
           style={{ marginRight: '8px' ,'--hover-textDecoration': "underline" }}>
            {data.attributes.ProductName} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
          {/* <div
  className={`${Style.highlight} ${data.attributes.Name ? Style.highlightContent : ''}`}
  style={{ marginRight: '8px', '--hover-textDecoration': 'underline' }}
>
  {data.attributes.Name && (
    <span>
      {data.attributes.Name}
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </span>
  )}
</div> */}

        {/* <div style={{ color: '#111111'  }}>
            ${data.attributes.Price}
          </div> */}
        </div>
         {data.attributes.Description.map(home => <div> <h3 className="mb-3 font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black  color: '#333333'">
            {/* {home.type} */}
          </h3>
          {home.children.map(res => <div>{res.text}</div>)}

          <p className="text-sm text-gray-500 font-bold">
            {home.Name}
          </p>
</div>)}
<div className="flex flex-wrap md:justify-center -m-2">
            <div className="w-full md:w-auto p-2 my-6">
              <Link
                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                href={`/product/${data.id}`}
              >
                View
              </Link>
            </div>
          </div> 
        </div>
      </div>
     </div>
     
  );
}







function ProductList(props) {
  const { loading, error, data } = useQuery(QUERY);

  if (error) return `Error loading products: ${error.message}`;
  if (loading) return <Loader />;

  const products = data && data.products && data.products.data ? data.products.data : [];

  const searchQuery = products.filter((product) =>
    product.attributes.ProductName.toLowerCase().includes(props.query.toLowerCase())
  );

  return (
    <div className="py-16 px-8 bg-white rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap -m-4 mb-6">
          {searchQuery.length > 0 ? (
            searchQuery.map((product) => <ProductCard key={product.id} data={product} />)
          ) : (
            <h1>No products Found</h1>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProductList;