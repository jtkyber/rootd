import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import debounce from '../utils/debounce'
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getSession, useSession } from 'next-auth/react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { ICurSort, setCurrentSort } from '../redux/searchSlice'
import { IUserState, setUser } from '../redux/userSlice'
import { setSelectedGroup, setUserGroups } from '../redux/groupSlice'
import { IGroup } from '../models/groupModel'
import { useOnScreen } from '../utils/hooks'
import getUser from '../utils/getUser'
import DropDown from '../components/DropDown'
import GroupCreation from '../components/GroupCreation'
import characters from '../characters.json'
import bookNames from '../bookNames.json'
import styles from '../styles/GroupSearch.module.css'
import dropdownStyles from '../styles/DropDown.module.css'
import LoadingAnimation from '../components/LoadingAnimation'
import NotAuthorizedScreen from '../components/NotAuthorizedScreen'
import Confirmation from '../components/Confirmation'

interface IOptions {
  keyword: string,
  characters: string[],
  books: string[],
  includePrivate: boolean
}

const groupSearch = () => {    
  const queryClient = useQueryClient()

  const router = useRouter()

  const { data: session }: any = useSession()

  const [options, setOptions] = useState<IOptions>({
    keyword: '',
    characters: [],
    books: [],
    includePrivate: true
  })

  const [page, setPage] = useState()
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)
  const [activePrivateGroup, setActivePrivateGroup] = useState<IGroup | null>(null)

  const dispatch = useAppDispatch()

  const user: IUserState = useAppSelector(state => state.user)
  const currentSort: ICurSort = useAppSelector(state => state.search.currentSort)

  const resultsEndRef: React.MutableRefObject<any> = useRef(null)

  const isVisible = useOnScreen(resultsEndRef)

  const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
    ['groups', [options, currentSort, page]], fetchGroups, {
        getNextPageParam: (lastPage, pages) => lastPage?.cursor
    }
  )

  useEffect(() => {
    const now = Date.now()
    if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
    setLastNextPageFetchTime(now)
    fetchNextPage()
  }, [isVisible, status])

  useEffect(() => {
    // if (!isFetching) sortGroups()
  }, [isFetching])

  async function fetchGroups({ pageParam = 0 }) {
    try {
      const res = await axios.get(`/api/findGroups?keyword=${options.keyword}&characters=${JSON.stringify(options.characters)}&books=${JSON.stringify(options.books)}&includePrivate=${options.includePrivate}&sortType=${currentSort.name}&sortDir=${currentSort.dir}&cursor=${pageParam}&limit=10`)
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (session?.user) {
      (async () => {
        const updatedUser: IUserState = await getUser(session.user.email)
        if (!user?._id && updatedUser?._id) dispatch(setUser(updatedUser))
        
        if (updatedUser?.groups?.length) {
          const userGroups = await axios.get(`/api/getUserGroups?groupIds=${JSON.stringify(updatedUser.groups)}`)
          if (userGroups?.data[0]) dispatch(setUserGroups(userGroups.data))
        }
      })()
    }

    document.addEventListener('click', handlePageClick)
    return () => document.removeEventListener('click', handlePageClick)
  }, [])

  const onKeywordChange = debounce((value) => setOptions({...options, keyword: value}), 500)

  const onBookChange = (e) => {
    e.target.checked 
    ? setOptions({...options, books: [...options.books, e.target.value]})
    : setOptions({...options, books: [...options.books.filter(item => item !== e.target.value)]})
  }

  const onCharacterChange = (e) => {
    e.target.checked 
    ? setOptions({...options, characters: [...options.characters, e.target.value]})
    : setOptions({...options, characters: [...options.characters.filter(item => item !== e.target.value)]})
  }

  const checkParent = (parent, child) => {
    let node = child.parentNode
    while (node != null) {
      if (node == parent) return true
      node = node.parentNode
    }
    return false
  }

  const handlePageClick = (e) => {
    //-----Close all dropdowns-----
    const btns = document.querySelectorAll(`.${dropdownStyles.selectorBtn}`)
    const options = document.querySelectorAll(`.${dropdownStyles.options}`)
    
    for (let i = 0; i < options.length; i++) {
      if ((e.target !== btns[i]) && (!checkParent(options[i], e.target))) {
            options[i].classList.remove(dropdownStyles.show)
      }
    }
  }

  function getTimeDiff(lastActive) {
    const currentDate = Date.now()
    const lastActiveDateTemp = new Date(lastActive)
    const lastActiveDate = lastActiveDateTemp.getTime()
    const msSinceLastActive = Math.abs(currentDate - lastActiveDate)
    const minsSinceLastActive = Math.ceil(msSinceLastActive / (1000 * 60))
    let timeSinceLastActive = minsSinceLastActive

    const includeS = (num) => num > 1.5 ? 's' : ''

    // is mimutes
    if(timeSinceLastActive < 60) {return `${Math.round(timeSinceLastActive)}min${includeS(timeSinceLastActive)}`} else timeSinceLastActive /= 60 
    // is hours
    if(timeSinceLastActive >= 1 && timeSinceLastActive < 24) {return `${Math.round(timeSinceLastActive)}hr${includeS(timeSinceLastActive)}`} else timeSinceLastActive /= 24
    // is days
    if(timeSinceLastActive >= 1 && timeSinceLastActive < 365) {return `${Math.round(timeSinceLastActive)}dy${includeS(timeSinceLastActive)}`} else timeSinceLastActive /= 365
    // is years
    if(timeSinceLastActive >= 365) return `${Math.round(timeSinceLastActive)}yr${includeS(timeSinceLastActive)}`

    return `${msSinceLastActive}ms`
  }

  const handleSortClick = (e) => dispatch(setCurrentSort(e.target.id))

  const handleResultClick = (e) => e.target.classList.toggle(styles.active)

  const handleJoinGroup = async (group, password = null) => {
    try {
      const res = await axios.post('/api/joinGroup', {
        userId: user._id,
        userName: user.username,
        groupId: group._id,
        password: password
      })
      const newGroup = res.data

      setActivePrivateGroup(null)
      dispatch(setUser({ ...user, groups: [ ...user.groups, newGroup ] }))
      dispatch(setSelectedGroup(newGroup))
      router.replace('/home')
    } catch(err) {
      console.log(err)
    }
  }

  return (
      <div className={styles.container}>
        {
          session ?
          <>
            <div className={styles.searchParams}>
              <input className={styles.keywordSearchInput} onChange={(e) => onKeywordChange(e.target.value.toLowerCase())} type='text' placeholder='Search Groups' />
    
              <DropDown idEnd='characters1' key='characters1' name='Characters' optionArray={characters} onSelection={onCharacterChange} />
    
              <DropDown idEnd='books1' key='books1' name='Books' optionArray={bookNames} onSelection={onBookChange} />
              
              <div className={styles.hidePrivateSection}>
                <label htmlFor='hidePrivate'>Hide Private Groups</label>
                <input onChange={(e) => setOptions({...options, includePrivate: !e.target.checked})} id='hidePrivate' type='checkbox' />
              </div>
    
              <button onClick={() => setCreatingGroup(true)} className={styles.groupCreation}>Create a New Group</button>
            </div>
    
            <div className={styles.sortContainer}>
              <h6 id='name' onClick={(e) => handleSortClick(e)} className={styles.nameSort}>Name {currentSort.name === 'name' && currentSort.dir === 'up' ? '▲' : '▼'}</h6>
              <h6 className={styles.summarySort}>Summary</h6>
              <div className={styles.sortRightChunk}>
                <h6 id='members' onClick={(e) => handleSortClick(e)} className={styles.memberSort}>Members {currentSort.name === 'members' && currentSort.dir === 'up' ? '▲' : '▼'}</h6>
                <h6 id='lastActive' onClick={(e) => handleSortClick(e)} className={styles.lastActiveSort}>Last Active {currentSort.name === 'lastActive' && currentSort.dir === 'up' ? '▲' : '▼'}</h6>
                <h6 id='isPrivate' onClick={(e) => handleSortClick(e)} className={styles.privateSort}>Private {currentSort.name === 'isPrivate' && currentSort.dir === 'up' ? '▲' : '▼'}</h6>
              </div>
            </div>
            <div className={styles.searchResults}>
              {data?.pages?.map((page, i) => (
                  <Fragment key={i}>
                    {page?.data?.map((group: IGroup, j) => {
                      return <div onClick={(e) => handleResultClick(e)} className={styles.result} key={j}>
                        <h3 className={styles.name}>{group.name}</h3>
                        {
                          group?._id && user?.groups.includes(group._id.toString())
                          ? <h5 className={styles.joined}>Joined</h5>
                          : <button onClick={() => group.isPrivate ? setActivePrivateGroup(group) : handleJoinGroup(group)} className={styles.joinBtn}>Join</button>
                        }
                        <p className={styles.summary}>{group.summary}</p>
                        <div className={styles.resultRightChunk}>
                          <h5 className={styles.memberCount}>{group.members.length}</h5>
                          <h5 className={styles.lastActive}>{getTimeDiff(group.lastActive)}</h5>
                          <h5 className={styles.isPrivate}>{group.isPrivate ? 'Yes' : 'No'}</h5>
                        </div>
                      </div>
                    })}
                  </Fragment>
                ))}
                <div ref={resultsEndRef}></div>
                {
                    isFetching 
                    ? <div className={styles.loadingMsgs}><LoadingAnimation /></div>
                    : null
                }
            </div>
    
            { creatingGroup && user?._id ? <GroupCreation setCreatingGroup={setCreatingGroup} userId={user._id.toString()} /> : null }
            
            { activePrivateGroup ? <Confirmation exitFunction={() => setActivePrivateGroup(null)} enterFunction={(password) => handleJoinGroup(activePrivateGroup, password)} /> : null }
          </>
          : <NotAuthorizedScreen />
        }
      </div>
  )
}

export default groupSearch

export async function getServerSideProps({req}) {
  const session: any = await getSession({req})

  if (!session) return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  }

  return {
    props: { 
      session
    }
  }
}