import React, { useState, useEffect, useRef } from 'react'
import DropDown from './DropDown'
import characters from '../characters.json'
import bookNames from '../bookNames.json'
import styles from '../styles/GroupCreation.module.css'
import axios from 'axios'
import { IUserState } from '../redux/userSlice'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { useRouter } from 'next/router'
import { IGroup } from '../models/groupModel'

interface IParams {
    setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>
    userId: string
}

interface IValues {
    name: string
    summary: string
    books: string[]
    characters: string[]
    tags: string[]
    private: boolean
}

const GroupCreation = ({setCreatingGroup, userId} : IParams) => {
    const progressMapRef: React.MutableRefObject<any> = useRef(null)
    const tagInputRef: React.MutableRefObject<any> = useRef(null)

    const router = useRouter()

    const dispatch = useAppDispatch()

    const sectionNames = ["Name", "Summary", "Books", "Characters", "Tags", "Private"]

    const user: IUserState = useAppSelector(state => state.user.user)

    const [sectionIndex, setSectionIndex] = useState(0)
    const [currentTagValue, setCurrentTagValue] = useState('')
    const [values, setValues] = useState<IValues>({name: "", summary: "", books: [], characters: [], tags: [], private: false})

    useEffect(() => {
        for (let i = 0; i < progressMapRef.current.children.length; i++) {
            if (i > 0) progressMapRef.current.children[i].disabled = true
        }
    }, [])

    const goToNextSection = (index) => {
        setSectionIndex(index)
        progressMapRef.current.children[index].disabled = false
    }

    const handleAddTag = () => {
        if (values.tags.includes(currentTagValue)) return
        tagInputRef.current.value = ''
        setValues({...values, tags: [...values.tags, currentTagValue]})
    }

    const runChecks = () => {
        switch(sectionIndex) {
            case 0:
                values.name.length ? goToNextSection(1) : console.log('error')
                break
            case 1:
                values.summary.length ? goToNextSection(2) : console.log('error')
                break
            case 2:
                values.books.length ? goToNextSection(3) : console.log('error')
                break
            case 4:
                values.tags.length > 1 ? goToNextSection(5) : console.log('error')
                break
            case 5:
                addNewGroup()
                break
            default: 
                goToNextSection(sectionIndex + 1)
                break
        }
    }

    const joinGroup = async (group: IGroup) => {
        try {
          const res = await axios.post('/api/joinGroup', {
            userId: userId,
            userName: user.username,
            groupId: group._id,
          })
    
          if (res.data.groups.includes(group._id)) router.replace('/home')
        } catch(err) {
          console.log(err)
        }
      }

    const addNewGroup = async () => {
        try {
            const res = await axios.post('/api/createGroup', {
                username: user.username,
                name: values.name,
                summary: values.summary,
                books: values.books,
                characters: values.characters,
                tags: values.tags,
                isPrivate: values.private
            })

            if (res.data) joinGroup(res.data)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.groupCreationContainer}>
                <div ref={progressMapRef} className={styles.progressMap}>
                    {
                        sectionNames.map((name, i) => <button key={i} onClick={() => setSectionIndex(i)}>{name}</button>)
                    }
                </div>

                <div className={styles.section}>
                    <button 
                            onClick={() => setCreatingGroup(false)} 
                            className={styles.exitBtn}>X
                    </button>
                    <h1 className={styles.sectionTitle}>{sectionNames[sectionIndex]}</h1>
                    <div className={styles.sectionContent}>
                    {
                        sectionIndex === 0 
                            ? 
                            <>
                                <input 
                                    onChange={(e) => setValues({...values, name: e.target.value})} 
                                    type='text'
                                    value={values.name} 
                                />
                            </>
                        : sectionIndex === 1 
                            ? 
                            <>
                                <textarea 
                                    className={styles.summary}
                                    onChange={(e) => setValues({...values, summary: e.target.value})} 
                                    value={values.summary} 
                                />
                            </>
                        : sectionIndex === 2 
                            ? 
                            <>
                                <DropDown 
                                    key='books2'
                                    idEnd='books2'
                                    name='Books' 
                                    optionArray={bookNames} 
                                    onSelection={(e) => setValues({...values, books: e.target.checked ? [...values.books, e.target.value] : values.books.filter(item => item !== e.target.value)})}
                                    selectedValues={values.books}
                                />
                            </>
                        : sectionIndex === 3 
                            ? 
                            <>
                                <DropDown 
                                    key='characters2'
                                    idEnd='characters2'
                                    name='Characters' 
                                    optionArray={characters} 
                                    onSelection={(e) => setValues({...values, characters: e.target.checked ? [...values.characters, e.target.value] : values.characters.filter(item => item !== e.target.value)})}
                                    selectedValues={values.characters}
                                />
                            </>
                        : sectionIndex === 4 
                            ? 
                            <div className={styles.tagContainer}>
                                <div className={styles.tags}>
                                    { values.tags.map((tag, i) => (
                                    <h5 
                                        onClick={(e) => setValues({...values, tags: values.tags.filter(item => item !== (e.target as HTMLHeadingElement).innerText)})} 
                                        className={styles.tag} 
                                        key={i}>{tag}
                                    </h5>)) }
                                </div>
                                <div className={styles.tagInputContainer}>
                                    <input 
                                        ref={tagInputRef}
                                        className={styles.tagInput} 
                                        type="text" 
                                        onChange={(e) => setCurrentTagValue(e.target.value)}
                                        maxLength={20}
                                    />
                                    <button 
                                        onClick={handleAddTag}  
                                        className={styles.addTagBtn}
                                        disabled={values.tags.length >= 5}>
                                        +
                                    </button>
                                </div>
                            </div>
                        : sectionIndex === 5 
                            ? 
                            <div className={styles.isPrivateContainer}>
                                <label htmlFor='isPrivateCheckbox'>Make group private</label>
                                <input 
                                    onChange={(e) => setValues({...values, private: !values.private})} 
                                    type='checkbox'
                                    checked={values.private}
                                    id='isPrivateCheckbox'
                                />
                            </div>
                        : null
                    }
                    </div>
                    <button 
                        onClick={() => sectionIndex <= 5 ? runChecks() : null} 
                        className={styles.nextBtn}>{sectionIndex < 5 ? 'Next' : 'Finish'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default GroupCreation