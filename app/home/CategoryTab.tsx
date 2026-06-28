import * as React from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import HoverSlider from './HoverSlider';
import { API_CONFIG, getApiUrl } from '../utils/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type Props = {
  enabled: boolean;
};

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 1 }}>{children}</Box>}
    </div>
  );
}

/* function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
} */

function CategoryTab({enabled}: Props) {

  const [value, setValue] = React.useState(0);

  /*  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
     setValue(newValue);
   }; */

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ALLPRODUCTS);
      const requestOptions = API_CONFIG.createRequestOptions(
        API_CONFIG.HTTP_METHODS.GET
      );

      const response = await fetch(apiUri, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      // ✅ Sort newest first by createdAt
      type Product = {
        createdAt: string; // or Date if already parsed
      };

      const sortedProducts = data.products.sort(
        (a: Product, b: Product) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return sortedProducts;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    enabled,
  });

  const showSkeleton = !enabled || isLoading;

  if (showSkeleton) {
    return(
      <div className="flex flex-wrap gap-y-3">
        {
          [...Array(10)].map((_, i) => {
            return (
              <div key={i} className="w-[50%] md:w-[33%] lg:w-[20%] px-0.5">
                <div >
                  <Skeleton variant="rectangular" width={'100%'} height={250} />
                  <Skeleton variant="text" width={50} />
                  <Skeleton variant="text" width={'100%'} />
                  <Skeleton variant="text" width={100} />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }

  return (
    <Box sx={{ width: '100%', padding: 0 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {/* <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs> */}
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className='flex flex-wrap gap-y-3'>
          {
            products?.slice(0, 10).map((item: any, i: number) => {
              return (
                item.isActive ? (
                  <div key={i} className={`w-[50%] md:w-[33%] lg:w-[20%] px-0.5`}>
                    <div>
                      <div className='relative'>
                        <HoverSlider
                          thumbnails={item.thumbnails}
                          slug={item.slug}
                          eagerLoad={i === 0}
                        />
                        {
                          item.averageRating > 0 && (
                            <div className='absolute top-0 left-0 bg-[#ddddddc6] pt-[2px] px-1 m-2 rounded flex items-center gap-x-2'>
                              <span className='text-[13px] font-semibold'>{item.averageRating}<span className="w-5">⭐</span></span>
                            </div>
                          )
                        }
                      </div>
                      <div className='pt-1'>
                        <span className='text-[16px] text-[#ff741f] font-semibold uppercase'>{item.brand}</span>
                        <Link href={`products/${item.slug || item._id}`} prefetch>
                          <h3 className='font-medium text-[15px] lg:text-[15px] leading-tight mb-1 line-clamp-1'>{item.name}</h3>
                        </Link>
                        <div className='flex gap-x-2'>
                          <p className='text-[14px]'>₹{item.variants[0].price}</p>
                          <p className="text-gray-400 text-[14px] line-through flex items-center">₹{parseInt(item.variants[0].price * (item.variants[0].discount / 100) + item.variants[0].price)}</p>
                          <p className='text-[#ff741f] text-[14px]'>({item.variants[0].discount}% Off)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                ) : null
              )
            })
          }
        </div>
      </CustomTabPanel>
      {/*  <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel> */}
    </Box>
  );
}

export default React.memo(CategoryTab);