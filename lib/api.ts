import axios from 'axios';
import qs from 'qs';

const strapiBaseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';

export const fetchArticles = async () => {
  const query = qs.stringify({
    populate: '*',
  });

  const res = await axios.get(`${strapiBaseUrl}/api/articles?${query}`);

  // ここが重要！
  return res.data?.data || [];
};

