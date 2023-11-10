// A custom hook that builds on useLocation to parse
// the query string for you.
import {useLocation} from 'react-router-dom';
import {useMemo} from 'react';

const useUrlParams = () => {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

export default useUrlParams