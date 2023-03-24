import React, { useState, useEffect, useRef } from 'react'
import books from '../books.json'
import parse from 'html-react-parser'
import styles from '../styles/PsgSelector.module.css'

const initialPsgContent = {
    book: '',
    starting: {
        chapter: 0,
        verse: 0
    },
    ending: {
        chapter: 0,
        verse: 0
    }
}

const PsgSelector = ({ textArea, setAddingPsg }) => {
    const [ starting, setStarting ] = useState(true)
    const [ bookIndex, setBookIndex ] = useState(0)
    const [ bookResults, setBookResults ] = useState<number[]>([])
    const [ psgContent, setPsgContent ] = useState(initialPsgContent)

    const bookResultsRef: React.MutableRefObject<any> = useRef(null)
    const bookInputRef: React.MutableRefObject<any> = useRef(null)

    useEffect(() => {
        document.addEventListener('click', handlePageClick)

        return () => document.removeEventListener('click', handlePageClick)
    }, [])

    useEffect(() => {
        if (starting) setPsgContent({...psgContent, ending: {...initialPsgContent.ending}})
    }, [starting])

    const handlePageClick = (e) => { 
        if (!e.target.classList.contains(styles.book)) bookResultsRef.current.style.display = 'none' 
    }

    const handleInputChange = (e) => {
        if (!parseInt(e.target.value) && e.target.value.length) return
        const input = e.target.value.length ? parseInt(e.target.value) : 0
        if (starting) {
            if (e.target.classList.contains(styles.chapter)) {
                if (input === 0 || input <= books[bookIndex].chapters.length) {
                    setPsgContent({...psgContent, starting: {...psgContent.starting, chapter: input, verse: 0}})
                }
            }
            else if (e.target.classList.contains(styles.verse)) {
                if (input === 0 || (input <= parseInt(books[bookIndex].chapters[psgContent.starting.chapter - 1]?.verses))) {
                    setPsgContent({...psgContent, starting: {...psgContent.starting, verse: input}})
                }
            }
        } else {
            if (e.target.classList.contains(styles.chapter)) {
                if (input === 0 || input <= books[bookIndex].chapters.length) {
                    setPsgContent({...psgContent, ending: {...psgContent.ending, chapter: input, verse: 0}})
                }
            }
            else if (e.target.classList.contains(styles.verse)) {
                if (input === 0 || (input <= parseInt(books[bookIndex].chapters[psgContent.ending.chapter - 1]?.verses))) {
                    setPsgContent({...psgContent, ending: {...psgContent.ending, verse: input}})
                }
            }
        }
    }

    const handleBookInputChange = (e) => {
        if (psgContent.book.length) setPsgContent(initialPsgContent)
        const filteredBooks: number[] = []
        books.forEach((book, i) => {
            if (e.target.value.length && book.book.toLowerCase().includes(e.target.value.toLowerCase())) return filteredBooks.push(i)
            return
        })
        setBookResults(filteredBooks.slice(0, 5))

        if (e.target.value.length) {
            bookResultsRef.current.style.display = 'flex'
        } else bookResultsRef.current.style.display = 'none'
    }

    const setSelectedBook = (i) => {
        setPsgContent({...psgContent, book: books[i].book})

        setBookIndex(i)
        bookInputRef.current.value = books[i].book
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (
            starting 
            && psgContent.book.length 
            && psgContent.starting.chapter > 0 
            && psgContent.starting.verse > 0
        ) setStarting(false)
        else {
            if ((psgContent.ending.chapter > 0 && psgContent.ending.verse > 0) && (psgContent.ending.chapter < psgContent.starting.chapter) || (psgContent.ending.chapter === psgContent.starting.chapter && psgContent.ending.verse <= psgContent.starting.verse)) return
            const passage = psgContent.ending.chapter > 0 && psgContent.ending.verse > 0 ?
            `${psgContent.book} ${psgContent.starting.chapter}:${psgContent.starting.verse}-${psgContent.ending.chapter}:${psgContent.ending.verse}`
            : `${psgContent.book} ${psgContent.starting.chapter}:${psgContent.starting.verse}`

            const passageHTML = `<span class='passageLink' contentEditable='false' id=${passage.replaceAll(' ', '%20')}>${passage}</span>`
            textArea.innerHTML = textArea.innerHTML + passageHTML
            setAddingPsg(false)
        }
    }

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <div className={styles.exit}><button onClick={() => setAddingPsg(false)} type='button'>X</button></div>
            <h4 className={styles.title}>{ starting ? 'Select Starting Verse' : 'Select Ending Verse' }</h4>
            <div className={styles.optionContainer}>
                <div ref={bookResultsRef} className={styles.bookResults}>
                    {
                        bookResults.map((bookIndex, i) => {
                            return <h5 onClick={() => setSelectedBook(bookIndex)} key={i} className={styles.result}>{books[bookIndex].book}</h5>
                        })
                    }
                </div>
                {starting ? <input ref={bookInputRef} placeholder='Book' onChange={(e) => handleBookInputChange(e)} className={`${styles.option} ${styles.book}`} type='text'></input> : null}
                <input disabled={!psgContent.book.length} placeholder='Chapter' onChange={(e) => handleInputChange(e)} value={starting ? (psgContent.starting.chapter > 0 ? psgContent.starting.chapter : '') : (psgContent.ending.chapter > 0 ? psgContent.ending.chapter : '')} className={`${styles.option} ${styles.chapter}`} type='text'></input>
                <input disabled={!psgContent.book.length} placeholder='Verse' onChange={(e) => handleInputChange(e)} value={starting ? (psgContent.starting.verse > 0 ? psgContent.starting.verse : '') : (psgContent.ending.verse > 0 ? psgContent.ending.verse : '')} className={`${styles.option} ${styles.verse}`} type='text'></input>
            </div>
            <div className={styles.buttonContainer}>
                {!starting ? <button onClick={() => setStarting(true)} className={styles.backBtn} type='button'>Back</button> : null}
                <button className={styles.submitBtn} type='submit'>{starting ? 'Next' : 'Finish'}</button>
            </div>
        </form>
    )
}

export default PsgSelector