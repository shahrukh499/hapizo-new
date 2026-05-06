import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Avatar, Rating } from '@mui/material';
import Image from 'next/image';
import LikeDisLikeReviews from './LikeDislikeReviews';

type DetailsTabProps = {
    bodyHtml: string;
    features: {
        title: string;
        desc: string;
    }[];
    review: {
        ratingSummary: {
            percentageBreakdown: {
                [key: number]: number;
            };
            totalReviews: number;
            averageRating: number;
        };
        reviews: {
            _id: string;
            userId: {
                name: string;
            };
            rating: number;
            comment: string;
            images: string[];
            helpfulVotes: string | number;
            dislikeVotes: string | number;
        }[];
    };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props : TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index : number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DetailsTab = ({ bodyHtml, features, review } : DetailsTabProps) => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event : React.SyntheticEvent<Element, unknown>, newValue : number) => {
    setValue(newValue);
  };

  //console.log(review, 'review')

  

  const ratingBars = React.useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => (
      <div key={star} className="flex items-center gap-3">
        <span className="w-6">{star}⭐</span>
        <div className="flex-1 bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${review?.ratingSummary?.percentageBreakdown[star]}%` }}
          />
        </div>
        <span className="w-10 text-sm">
          {review?.ratingSummary?.percentageBreakdown[star]}%
        </span>
      </div>
    ));
  }, [review]);

  const reviewList = React.useMemo(() => {
    return review?.reviews?.length > 0 ? (
      review?.reviews?.map((rev, i) => {
        return (
          <div key={rev._id} className='shadow p-5 rounded-2xl mb-3'>
            <div className='flex items-center gap-x-3 mb-3'>
              <div>
                <Avatar>{rev.userId.name.slice(0, 1)}</Avatar>
              </div>
              <div>
                <h4 className='font-semibold'>{rev.userId.name}</h4>
                <Rating name="read-only" value={rev.rating} size="small" readOnly />
              </div>
            </div>
            <div className='mb-3'>
              <p className='text-gray-500'>{rev.comment}</p>
            </div>
            {
              rev?.images.length > 0 && (
                <div className='flex flex-wrap gap-x-2'>
                  {
                    rev?.images.map((img, i) => {
                      return (
                        <Image key={i} className='h-20 w-20 object-cover object-center rounded' src={img} alt='reviews' width={100} height={100} />
                      )
                    })
                  }
                </div>
              )
            }
            <LikeDisLikeReviews
              reviewId={rev._id}
              like={rev?.helpfulVotes}
              dislike={rev?.dislikeVotes}
            />
          </div>
        )
      })
    ) : (
      <p>No Reviews</p>
    )
  }, [review])

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab sx={{ textTransform: 'capitalize' }} label="Description" {...a11yProps(0)} />
          <Tab sx={{ textTransform: 'capitalize' }} label="Additional information" {...a11yProps(1)} />
          <Tab sx={{ textTransform: 'capitalize' }} label="Reviews" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div
          className="text-[15px] text-gray-500 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div className="overflow-x-auto ">
          <table className="min-w-200 lg:max-w-200 border-separate border-spacing-1">
            <tbody className="divide-y divide-gray-200">
              {
                features?.length > 0 ? (
                  features?.map((el : { title: string; desc: string }, i:number) => {
                    return (
                      <tr key={i} className="odd:bg-neutral-200 even:bg-neutral-50">
                        <th className="px-6 py-4 w-50 text-start">{el.title}</th>
                        <td className="px-6 py-4 text-end">{el.desc}</td>
                      </tr>
                    )
                  })

                ) : (
                  <tr>
                    <td>Oops No Additional Information Available</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <div className='flex flex-col gap-y-8'>
          <div>
            <h3 className='text-[25px] font-semibold'>Customer Feedback</h3>
          </div>
          <div className='flex flex-wrap gap-y-3'>
            <div className='w-full lg:w-[40%] px-5 lg:px-0 lg:pe-10 lg:border-r-2 border-gray-200'>
              <div className='w-full'>
                <div className="space-y-2">{ratingBars}</div>
              </div>
            </div>
            <div className='w-full md:w-[50%] lg:w-[30%] flex justify-center flex-col lg:border-r-2 border-gray-200'>
              <div className='text-center py-4 md:py-8'>
                <h3 className='text-[25px]'>Total Reviews</h3>
                <div className='flex justify-center items-center gap-x-2'>
                  <h4 className='text-gray-600 text-[40px]'>{review?.ratingSummary?.totalReviews}</h4>
                  <span>Reviews</span>
                </div>
              </div>
            </div>
            <div className='w-full md:w-[50%] lg:w-[30%] flex justify-center flex-col'>
              <div className='text-center py-4 md:py-8'>
                <h3 className='text-[25px]'>Average Ratings</h3>
                <div className='flex justify-center items-center'>
                  <h4 className='text-gray-600 text-[40px]'>{review?.ratingSummary?.averageRating}</h4>
                  <span className="w-6">⭐</span>
                </div>
              </div>
            </div>
          </div>
          <div>{reviewList}</div>
        </div>
      </CustomTabPanel>
    </Box>
  );
}


export default React.memo(DetailsTab);