import React, { useState, useEffect, useRef } from 'react'
import DropDown from './DropDown'
import characters from '../characters.json'
import bookNames from '../bookNames.json'
import styles from '../styles/GroupCreation.module.css'
import axios from 'axios'
import { IUserState } from '../redux/userSlice'
import { useAppSelector } from '../redux/hooks'
import { useRouter } from 'next/router'
import { IGroup } from '../models/groupModel'
import mongoose from 'mongoose'

interface IParams {
    setCreatingGroup: React.Dispatch<React.SetStateAction<boolean>>
    userId: string
}

interface IValues {
    name: string
    description: string
    books: string[]
    characters: string[]
    tags: string[]
    private: boolean
}

const GroupCreation = ({ setCreatingGroup, userId } : IParams) => {
    const progressMapRef: React.MutableRefObject<any> = useRef(null)
    const tagInputRef: React.MutableRefObject<any> = useRef(null)
    const btnRef: React.MutableRefObject<any> = useRef(null)

    const router = useRouter()

    const sectionNames = ["Name", "Description", "Books", "Characters", "Tags", "Private"]

    const user: IUserState = useAppSelector(state => state.user)

    const [sectionIndex, setSectionIndex] = useState(0)
    const [groupRequestSent, setGroupRequestSent] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [currentTagValue, setCurrentTagValue] = useState('')
    const [values, setValues] = useState<IValues>({ name: "", description: "", books: [], characters: [], tags: [], private: false })

    useEffect(() => {
        if (!progressMapRef?.current) return
        for (let i = 0; i < progressMapRef.current.children.length; i++) {
            if (i > 0) progressMapRef.current.children[i].disabled = true
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUp)

        return () => document.removeEventListener('keyup', handleKeyUp)
    }, [btnRef.current])

    useEffect(() => {
        setErrMsg('')
    }, [values])

    const handleKeyUp = (e) => {
        if (e.code !== 'Enter') return
        btnRef?.current.click()
    }

    const handleKeyDown = (e) => { if (e.code === 'Tab') e.preventDefault() }

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
                values?.name?.trim()?.length ? 
                    values.name.length < 50 ? goToNextSection(1) : setErrMsg('Name must be under 50 characters')
                : setErrMsg('Please include a group name') 
                break
            case 1:
                values.description.length >= 15 ? goToNextSection(2) : setErrMsg('Please write a longer description')
                break
            case 2:
                values.books.length ? goToNextSection(3) : setErrMsg('Please include at least one book')
                break
            case 4:
                values.tags.length > 1 ? goToNextSection(5) : setErrMsg('Please include at least two tags')
                break
            case 5:
                if (user?.isAdmin) addNewGroup()
                else {
                    addNewGroup()
                }
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
                groupId: new mongoose.Types.ObjectId,
                userId: user._id,
                groupAdmin: user.username,
                name: values.name.trim(),
                description: values.description.trim(),
                books: values.books,
                characters: values.characters,
                tags: values.tags,
                isPrivate: values.private
            })

            if (res?.data?._id) {
                joinGroup(res.data)
            } else if (res?.data) {
                setGroupRequestSent(true)
                setTimeout(() => setCreatingGroup(false), 3000) 
            }
        } catch(err) {
            const errObject = err.response?.data
            if (!errObject?.section) return
            const index = sectionNames.indexOf(errObject.section)
            setSectionIndex(index)
            if (!errObject?.msg) return
            setErrMsg(errObject.msg)
        }
    }


    const handleOnTagInputChange = (e) => {
        if (e.target.value.slice(-1) === ',' && currentTagValue.length) handleAddTag() 
        else setCurrentTagValue(e.target.value)
    }

    return (
        <div className={styles.container}>
            <div className={styles.groupCreationContainer}>
            {
                !groupRequestSent ?
                <>
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
                        <h5 className={styles.errorMessage}>{errMsg}</h5>
                        <div className={styles.sectionContent}>
                        {
                            sectionIndex === 0 
                                ? 
                                <>
                                    <h5 className={styles.instructions}>Choose a name for your group</h5>
                                    <input 
                                        onChange={(e) => setValues({...values, name: e.target.value})} 
                                        type='text'
                                        value={values.name} 
                                        maxLength={50}
                                    />
                                </>
                            : sectionIndex === 1 
                                ? 
                                <>
                                    <h5 className={styles.instructions}>Explain what your group is about</h5>
                                    <textarea 
                                        className={styles.description}
                                        onChange={(e) => setValues({...values, description: e.target.value})} 
                                        value={values.description} 
                                    />
                                </>
                            : sectionIndex === 2 
                                ? 
                                <>
                                    <h5 className={styles.instructions}>Select the book(s) involved in this group</h5>
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
                                    <h5 className={styles.instructions}>Select the characters(s) involved in this group (optional)</h5>
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
                                <>
                                    <h5 className={styles.instructions}>Add 2-5 tags related to your group (this will make your group easier to find)</h5>
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
                                                onChange={handleOnTagInputChange}
                                                maxLength={20}
                                                disabled={values.tags.length >= 5}
                                            />
                                            <button 
                                                onClick={handleAddTag}  
                                                className={styles.addTagBtn}
                                                disabled={values.tags.length >= 5}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </>
                            : sectionIndex === 5 
                                ? 
                                <>
                                    <h5 className={styles.instructions}>Private groups require a password to join</h5>
                                    <div className={styles.isPrivateContainer}>
                                        <label htmlFor='isPrivateCheckbox'>Make group private</label>
                                        <input 
                                            onChange={(e) => setValues({...values, private: !values.private})} 
                                            type='checkbox'
                                            checked={values.private}
                                            id='isPrivateCheckbox'
                                        />
                                    </div>
                                </>
                            : null
                        }
                        </div>
                        <button 
                            ref={btnRef}
                            onClick={() => sectionIndex <= 5 ? runChecks() : null} 
                            className={styles.nextBtn}>
                                {sectionIndex < 5 ? 'Next' : 'Finish'}
                        </button>
                    </div>
                </>
                : <h3 className={styles.creationReqConfirmationMsg}>Group creation request has been sent. You will be notified as soon as the group is accepted</h3>
            }
            </div>
        </div>
    )
}

export default GroupCreation