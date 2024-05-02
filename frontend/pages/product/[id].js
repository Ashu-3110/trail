
import { gql, useQuery } from "@apollo/client";
import { centsToDollars } from "@/utils/centsToDollars";
import { useRouter } from "next/router";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Loader from '@/components/Loader';
import { useState } from 'react';

const GET_PRODUCT_DETAILS = gql`
query ($id: ID!) {
  product(id: $id) {
    data {
      id
      attributes {
        Name
        product_details {
          data {
            id
            attributes {
              Name
              Description
              OtherInfo
              Ingredients
              Allergens
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
    }
  }
  productSizeCosts {
    data {
      id
      attributes {
        Size
        Cost
        product{
          data {
          id
        }
      }
      }
    }
  }
}
`



// function DishCard({ data }) {
//   function handleAddItem() {
//     // will add some logic here
//   }

//   return (
//     <div className="w-full md:w-1/2 lg:w-1/3 p-4">
//       <div className="h-full bg-gray-100 rounded-2xl">
//         <Image
//           className="w-full rounded-2xl"
//           height={300}
//           width={300}
//           src={`${process.env.STRAPI_URL || "http://127.0.0.1:1337"}${
//             data.attributes.Image.data[0].attributes.url
//           }`}
//           alt=""
//         />
//         <div className="p-8">
//           <div className="group inline-block mb-4" href="#">
//             <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
//               {data.attributes.Name}
//             </h3>
//             <h2>${(data.attributes.Cost)}</h2>
//           </div>
        
//             {data.attributes.Description.map(home => <div> <h3 className="mb-3 font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black  color: '#333333'">
//           </h3>
//           {home.children.map(res => <div>{res.text}</div>)}
//           <p className="text-sm text-gray-500 font-bold">
//           {home.Name}
//           </p>
//           </div>)}
//           <div className="flex flex-wrap md:justify-center -m-2">
//             <div className="w-full md:w-auto p-2 my-6">
//               <button
//                 className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
//                 onClick={handleAddItem}
//               >
//                 + Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



function DishCard({ data , productIndex, productSizeCosts  }) {
  const [expanded, setExpanded] = useState(false);

  const toggleDetails = () => {
    setExpanded(prevExpanded => !prevExpanded);
  };
  
  let sizes = [];
  let costs = [];
  
  if (productSizeCosts && Array.isArray(productSizeCosts.data)) {
    productSizeCosts.data.forEach(sizeObj => {
      if (sizeObj.attributes.product.data.id === data.id) {
        sizes.push(sizeObj.attributes.Size);
        costs.push(sizeObj.attributes.Cost);
      }
    });
  }
  return (
    <div className="w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="h-full rounded-2xl grid grid-cols-1 md:grid-cols-2">
        {/* Image Column */}
        <div>
          <img style= {{
    maxWdth: "500px",
    height: "auto",
    marginLeft: "-105px"
}}
            className="w-full rounded-t-2xl"
            src={`${process.env.STRAPI_URL || "http://127.0.0.1:1337"}${
              data.attributes.Image.data[0].attributes.url
            }`}
            alt=""
          />
        </div>
        {/* Details Column */}
        <div className="p-8 md:pl-4"  > {/* Added padding to the right */}
          <div className="group inline-block mb-4" href="#">
            <h3 className="font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
              {data.attributes.Name}
            </h3>
            <div>
              {sizes.map((size, index) => (
                <div key={index}>
                  <span>{size}</span>: <span>${costs[index]}</span>
                </div>
              ))}
            </div>
         
          </div>
          {data.attributes.Description.map((home, index) => (
            <div key={index}>
              <h3 className="mb-3 font-heading text-xl text-gray-900 hover:text-gray-700 group-hover:underline font-black">
                {home.Name}
              </h3>
              {home.children.map((res, index) => (
                <div key={index}>{res.text}</div>
              ))}
              <p className="text-sm text-gray-500 font-bold">
                {home.Name}
              </p>
            </div>
            ))}
          {/* <div className="flex flex-wrap md:justify-center -m-2">
            <div className="w-full md:w-auto p-2 my-6">
              <button
              style={{width: "300px",
                marginTop: "350px",
                marginLeft: "700px"}}
                className="block w-full px-12 py-3.5 text-lg text-center text-white font-bold bg-gray-900 hover:bg-gray-800 focus:ring-4 focus:ring-gray-600 rounded-full"
                onClick={handleAddItem}
              >
                + Add to Cart
              </button>
            </div>
          </div> */}
        <div className="p-8 md:pl-4 relative">
        <div className="group inline-block mb-4" href="#"><button onClick={toggleDetails} className="text-gray-500 hover:text-gray-700 focus:outline-none absolute top-0 right-0 mt-2 mr-2">
              {expanded ? '-' : '+'}
            </button></div>
     
          {expanded && (
            <div className="mt-2 bg-white rounded-lg shadow-md p-4">
              <h2 className="font-bold">Ingredients:</h2>
              <p>{data.attributes.Ingredients}</p>
              <h2 className="font-bold">Allergens:</h2>
              <p>{data.attributes.Allergens}</p>
            </div>
          )}
          </div>
        </div>
      </div>
     </div>
  );
}


export default function Product() {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_PRODUCT_DETAILS, {
    variables: { id: router.query.id },
  });

  if (error) return "Error Loading Products";
  if (loading) return <Loader />;
  if (data.product.data.attributes.product_details.data.length) {
    const { product ,  productSizeCosts  } = data;

    return (
      <div className="py-6">
        <h1 className="text-4xl font-bold text-green-600">
          {product.data.attributes.Name}
        </h1>
        <div className="py-16 px-8 bg-white rounded-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap -m-4 mb-6">
              {product.data.attributes.product_details.data.map((res , index) => {
                return <DishCard key={res.id} data={res} productIndex={index} productSizeCosts={productSizeCosts} />;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>No Products Found</h1>;
  }
}