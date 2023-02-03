import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/GroupSearch.module.css'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import debounce from '../utils/debounce';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { IGroup } from '../models/groupModel';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { ICurSort, setCurrentSort } from '../redux/searchSlice';

interface IOptions {
  keyword: string,
  characters: string[],
  books: string[],
  includePrivate: boolean
}

const groupSearch = () => {
  const router = useRouter()

  const queryClient = useQueryClient()

  const [options, setOptions] = useState<IOptions>({
    keyword: '',
    characters: [],
    books: [],
    includePrivate: true
  })

  const [page, setPage] = useState()

  const dispatch = useAppDispatch()

  const currentSort: ICurSort = useAppSelector(state => state.search.currentSort)

  const characterSelectorRef: React.MutableRefObject<any> = useRef(null)
  const bookSelectorRef: React.MutableRefObject<any> = useRef(null)

  const { data, status } = useQuery({
    queryKey: ['groups', [options, page]], 
    queryFn: () => fetchGroups(page),
    keepPreviousData: true
  })

  async function fetchGroups(page = 0) {
    return axios.get(`/api/findGroups?keyword=${options.keyword}&characters=${JSON.stringify(options.characters)}&books=${JSON.stringify(options.books)}&includePrivate=${options.includePrivate}`)
  }
  
  // useEffect(() => {
  //   console.log(options)
  // }, [options]))

  // useEffect(() => {
  //   console.log(data)
  // }, [data])

  useEffect(() => {
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
        if ((e.target !== btns[i] && !checkParent(options[i], e.target))) {
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
    if(!data?.data) return
    const dataTemp = [...data.data]
    
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

    queryClient.setQueryData(['groups', [options, page]], (prev: any) => ({
      ...prev,
      data: dataTemp
    }))
  }

  const handleSortClick = (e) => dispatch(setCurrentSort(e.target.id))

  return (
      <div className={styles.container}>
        <div className={styles.searchParams}>
          <input onChange={(e) => onKeywordChange(e.target.value)} type='text' placeholder='Search Groups' />

          <div className={`${styles.selector} ${styles.characters}`}>
            <button onClick={toggleCharacterList} className={styles.selectorBtn}>Characters</button>
            <div ref={characterSelectorRef} className={styles.options}>
              <div className={styles.checkboxChunk}>
                <input type='checkbox' onChange={(e) => onCharacterChange(e)} id="samuel" name='samuel' value='samuel' />
                <label htmlFor="samuel">samuel</label>
              </div>
              <div className={styles.checkboxChunk}>
                <input type='checkbox' onChange={(e) => onCharacterChange(e)} id="david" name='david' value='david' />
                <label htmlFor="david">david</label>
              </div>
              <div className={styles.checkboxChunk}>
                <input type='checkbox' onChange={(e) => onCharacterChange(e)} id="saul" name='saul' value='saul' />
                <label htmlFor="saul">saul</label>
              </div>
            </div>
          </div>

          <div className={`${styles.selector} ${styles.books}`}>
            <button onClick={toggleBookList} className={styles.selectorBtn}>Books</button>
            <div ref={bookSelectorRef} className={styles.options}>
            <div className={styles.checkboxChunk}>
              <input type='checkbox' onChange={(e) => onBookChange(e)} id="1 samuel" name='1 samuel' value='1 samuel' />
              <label htmlFor="1 samuel">1 samuel</label>
            </div>
            <div className={styles.checkboxChunk}>
              <input type='checkbox' onChange={(e) => onBookChange(e)} id="acts" name='acts' value='acts' />
              <label htmlFor="acts">acts</label>
            </div>
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
          {
            data?.data.map((group: IGroup, i) => {
              return <div onClick={(e) => e.preventDefault()} className={styles.result} key={i}>
                <h3 className={styles.name}>{group.name}</h3>
                <p className={styles.summary}>{group.summary}</p>
                <div className={styles.resultRightChunk}>
                  <h5 className={styles.memberCount}>{group.members.length}</h5>
                  <h5 className={styles.lastActive}>{getTimeDiff(group.lastActive)}</h5>
                  <h5 className={styles.isPrivate}>{group.isPrivate ? 'Yes' : 'No'}</h5>
                </div>
              </div>
            })
          }
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