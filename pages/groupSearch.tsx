import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useRouter } from 'next/router'
import debounce from '../utils/debounce'
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { getSession, useSession } from 'next-auth/react'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { ICurSort, setCurrentSort } from '../redux/searchSlice'
import { IUserState, setUser } from '../redux/userSlice'
import { setSelectedGroup } from '../redux/groupSlice'
import { IGroup } from '../models/groupModel'
import { useOnScreen } from '../utils/hooks'
import getUser from '../utils/getUser'
import characters from '../characters.json'
import books from '../books.json'
import styles from '../styles/GroupSearch.module.css'

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
  const [lastNextPageFetchTime, setLastNextPageFetchTime] = useState(0)

  const dispatch = useAppDispatch()

  const user: IUserState = useAppSelector(state => state.user.user)
  const currentSort: ICurSort = useAppSelector(state => state.search.currentSort)

  const characterSelectorRef: React.MutableRefObject<any> = useRef(null)
  const bookSelectorRef: React.MutableRefObject<any> = useRef(null)
  const resultsEndRef: React.MutableRefObject<any> = useRef(null)

  const isVisible = useOnScreen(resultsEndRef)

  const { data, status, isFetching, fetchNextPage, hasNextPage, error } = useInfiniteQuery(
    ['groups', [options, page]], fetchGroups, {
        getNextPageParam: (lastPage, pages) => lastPage?.cursor
    }
  )

  useEffect(() => {
    const now = Date.now()
    if (!isVisible || isFetching || (now - lastNextPageFetchTime) < 250 || !hasNextPage) return
    setLastNextPageFetchTime(now)
    fetchNextPage()
  }, [isVisible, status])

  async function fetchGroups({ pageParam = 0 }) {
    try {
      const res = await axios.get(`/api/findGroups?keyword=${options.keyword}&characters=${JSON.stringify(options.characters)}&books=${JSON.stringify(options.books)}&includePrivate=${options.includePrivate}&cursor=${pageParam}&limit=10`)
      return res.data
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (session.user && !user?.bVersion) {
      (async () => {
        const updatedUser: IUserState = await getUser(session.user.email)
        if (updatedUser) dispatch(setUser(updatedUser))
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

  const toggleCharacterList = (e): void => {
    e.preventDefault()
    characterSelectorRef.current.classList.toggle(styles.show)
  }

  const toggleBookList = (e): void => {
    e.preventDefault()
    bookSelectorRef.current.classList.toggle(styles.show)
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
    const btns = document.querySelectorAll(`.${styles.selectorBtn}`)
    const options = document.querySelectorAll(`.${styles.options}`)
    
    for (let i = 0; i < options.length; i++) {
      if ((e.target !== btns[i]) && (!checkParent(options[i], e.target))) {
            options[i].classList.remove(styles.show)
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

  useEffect(() => sortGroups(), [currentSort])

  const sortGroups = (): void => {
    if(!data?.pages[0]) return
    const dataTemp = data?.pages.map(page => page.data).flat()

    switch(currentSort.name) {
      case 'name':
        if (currentSort.dir === 'down') dataTemp.sort((a, b) => a.name.localeCompare(b.name)) 
        else dataTemp.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'members':
        if (currentSort.dir === 'down') dataTemp.sort((a, b) => a.members.length - b.members.length) 
        else dataTemp.sort((a, b) => b.members.length - a.members.length)
        break
        case 'lastActive':
          if (currentSort.dir === 'down') {
            dataTemp.sort((a, b) => {
              const dateA = new Date(a.lastActive)
              const dateB = new Date(b.lastActive)
              return dateB.getTime() - dateA.getTime()
            })
          } else dataTemp.sort((a, b) => {
            const dateA = new Date(a.lastActive)
            const dateB = new Date(b.lastActive)
            return dateA.getTime() - dateB.getTime()
          })
          break
        case 'isPrivate':
          if (currentSort.dir === 'down') dataTemp.sort((a, b) => a.isPrivate - b.isPrivate) 
          else dataTemp.sort((a, b) => b.isPrivate - a.isPrivate)
          break
    }


    function sliceIntoChunks(arr, chunkSize) {
      const res: any[] = []
      for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
      }
      return res
    }

    queryClient.setQueryData(['groups', [options, page]], (prev: any) => {
      const dataChunked = sliceIntoChunks(dataTemp, prev?.pages[0].cursor)
      return {
        ...data,
        pages: prev?.pages.map((page, i) => {
          return {
            ...page,
            data: dataChunked[i]
          } 
        })
      }
    })
  }

  const handleSortClick = (e) => dispatch(setCurrentSort(e.target.id))

  const handleResultClick = (e) => e.target.classList.toggle(styles.active)

  const handleJoinGroup = async (group) => {
    try {
      const res = await axios.post('/api/joinGroup', {
        userId: session.user._id,
        userName: session.user.username,
        groupId: group._id,
      })

      if (res.data.groups.includes(group._id)) {
        dispatch(setUser({ ...user, groups: res.data.groups }))
        dispatch(setSelectedGroup(group))
        router.replace('/home')
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
      <div className={styles.container}>
        <div className={styles.searchParams}>
          <input className={styles.keywordSearchInput} onChange={(e) => onKeywordChange(e.target.value)} type='text' placeholder='Search Groups' />

          <div className={`${styles.selector} ${styles.characters}`}>
            <button onClick={toggleCharacterList} className={styles.selectorBtn}>Characters</button>
            <div id='characterOptions' ref={characterSelectorRef} className={styles.options}>
              {
                characters.map((character, i) => (
                  <div key={i} className={styles.checkboxChunk}>
                    <input type='checkbox' onChange={(e) => onCharacterChange(e)} id={character} name={character} value={character} />
                    <label htmlFor={character}>{character}</label>
                  </div>
                ))
              }
            </div>
          </div>

          <div className={`${styles.selector} ${styles.books}`}>
            <button onClick={toggleBookList} className={styles.selectorBtn}>Books</button>
            <div id='bookOptions' ref={bookSelectorRef} className={styles.options}>
              {
                books.map((book, i) => (
                  <div key={i} className={styles.checkboxChunk}>
                    <input type='checkbox' onChange={(e) => onBookChange(e)} id={book.book + '-book'} name={book.book} value={book.book} />
                    <label className={styles.bookLabel} htmlFor={book.book + '-book'}>{book.book}</label>
                  </div>
                ))
              }
            </div>
          </div>
          
          <div className={styles.hidePrivateSection}>
            <label htmlFor='hidePrivate'>Hide Private Groups</label>
            <input onChange={(e) => setOptions({...options, includePrivate: !e.target.checked})} id='hidePrivate' type='checkbox' />
          </div>
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
          {data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.data.map((group: IGroup, j) => {
                  return <div onClick={(e) => handleResultClick(e)} className={styles.result} key={j}>
                    <h3 className={styles.name}>{group.name}</h3>
                    {
                      user.groups.includes(group._id)
                      ? <h5 className={styles.joined}>Joined</h5>
                      : <button onClick={() => handleJoinGroup(group)} className={styles.joinBtn}>Join</button>
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
            <div ref={resultsEndRef} className={styles.resultsEnd}></div>
        </div>
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