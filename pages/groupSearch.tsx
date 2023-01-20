import React from 'react';
import styles from '../styles/groupSearch.module.css'

const groupSearch = () => {
    return (
        <div className={styles.container}>
            <h1>Find Group</h1>
            <div className={styles.searchContainer}>
              <div className={styles.searchParams}>
                <form>
                  <input type='text' placeholder='Search keywords' />
                  <select id="characters" name='characters' defaultValue='Characters'>
                    <option value="Characters" disabled hidden>Characters</option>
                    <option value="paul">Paul</option>
                    <option value="david">David</option>
                  </select>
                  <select id="books" name='books' defaultValue='Books'>
                    <option value="Books" disabled hidden>Books</option>
                    <option value="1 samuel">1 Samuel</option>
                    <option value="acts">Acts</option>
                  </select>
                  <div className={styles.hidePrivateSection}>
                    <label htmlFor='hidePrivate'>Hide Private Groups</label>
                    <input id='hidePrivate' type='checkbox' />
                  </div>
                </form>
              </div>
              <div className={styles.searchResults}>
              </div>
            </div>

        </div>
    )
}

export default groupSearch