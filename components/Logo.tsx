import React from 'react'
import styles from '../styles/Nav.module.css'
import { useRouter } from 'next/router'

const Logo = () => {
    const router = useRouter()

    return (
        <svg onClick={() => router.push('/home')} className={styles.logo} width="398" height="216" viewBox="0 0 398 216" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M201.6 0.900152C200.667 2.50015 202.533 214.367 203.467 215.167C204 215.7 246.667 215.567 298.4 215.033C366.533 214.233 392.933 213.567 394.133 212.367C395.2 211.3 395.867 182.633 396.4 106.367L397.067 1.70015L393.867 0.900152C389.333 -0.299848 202.267 -0.299848 201.6 0.900152ZM393.467 7.56682C394.533 13.3002 393.2 209.3 392 210.367C391.067 211.433 217.2 213.567 210.533 212.633L205.067 211.833L204.133 116.9C203.2 32.9002 203.6 7.16682 205.6 3.56682C205.867 3.03349 248.133 2.63348 299.333 2.63348H392.533L393.467 7.56682Z" fill="white"/>
            <path d="M221.6 6.23363L207.333 6.76697L207.6 107.967C207.867 163.567 208.267 209.3 208.667 209.567C209.733 210.367 388.4 208.634 389.2 207.834C390.4 206.634 391.867 32.2336 390.8 18.2336L389.733 5.3003L312.933 5.56697C270.533 5.7003 229.6 6.1003 221.6 6.23363ZM312.667 10.367C312.667 11.0336 311.333 12.2336 309.733 13.0336C304.933 15.3003 321.6 15.0336 335.2 12.6336C341.467 11.567 346.8 10.9003 347.067 11.3003C347.467 11.567 346.933 12.9003 346 13.967C342.933 17.567 346.533 19.3003 357.333 19.3003C365.6 19.3003 367.6 18.9003 370.267 16.2336C374.533 12.367 375.333 12.5003 375.333 17.0336C375.333 21.567 372.667 24.2336 364.533 27.8336C356.4 31.4336 341.2 30.9003 335.467 26.767C330.4 23.167 329.733 23.3003 331.333 27.3003C332.933 31.4336 332.533 31.4336 325.6 27.4336C320.533 24.6336 308.667 21.567 308.667 23.167C308.667 23.567 310.133 26.1003 312 28.767C313.867 31.4336 315.333 34.2336 315.333 34.767C315.333 36.767 313.2 36.1003 310.533 33.167C307.333 29.567 300.667 26.1003 300.667 27.967C300.667 28.767 296.267 29.3003 289.733 29.3003L278.667 29.4336L284.933 32.6336C291.067 35.8336 293.6 38.2336 292.267 39.4336C291.867 39.8336 288.933 38.767 285.733 37.167C277.2 32.767 267.333 33.0336 258 37.967C250.933 41.8336 250.8 41.967 254.667 42.2336C269.467 43.7003 271.333 45.8336 259.067 47.0336C251.067 47.8336 237.6 52.2336 234.667 55.0336C233.733 55.967 234.267 55.967 236 55.3003C243.467 52.367 252.667 53.0336 252.667 56.6336C252.667 57.967 251.333 58.6336 249.067 58.6336C244.933 58.6336 235.067 63.167 232.533 66.1003C231.067 67.8336 231.333 67.967 234.4 67.3003C238.667 66.2336 239.067 67.967 235.333 71.3003C233.867 72.6336 232.667 74.6336 232.667 75.7003C232.667 76.6336 231.467 79.3003 230 81.3003C228.533 83.4336 225.867 87.7003 224 90.9003C220.533 97.0336 219.867 95.967 222.133 87.3003C223.6 81.167 224.533 72.767 225.2 59.4336C225.467 51.4336 225.867 49.967 228.4 48.9003C232.933 46.9003 232.133 41.7003 226.667 36.767C220.933 31.4336 220.8 30.1003 226 30.9003C231.2 31.7003 231.2 29.4336 226.267 23.8336C223.6 20.9003 221.2 19.567 218.267 19.4336C213.867 19.3003 212.533 16.767 216.133 15.4336C222.933 12.767 232.4 16.9003 235.333 23.8336C237.2 28.367 239.333 29.3003 239.333 25.567C239.467 24.367 240.267 21.8336 241.2 20.1003C242.933 16.9003 243.067 16.9003 244.533 19.7003C245.333 21.167 246 24.9003 246 27.8336C246 30.9003 246.667 33.3003 247.333 33.3003C248.133 33.3003 248.667 32.6336 248.667 31.967C248.667 31.167 250.133 28.367 251.733 25.567C253.467 22.9003 256 18.9003 257.333 16.767C260.133 12.1003 262 13.967 262 21.567C262 24.367 262.4 26.6336 262.8 26.6336C263.2 26.6336 267.067 23.567 271.333 19.8336C279.067 13.167 282.933 12.2336 281.6 17.4336C280.667 20.767 281.467 20.6336 293.6 15.8336C309.333 9.43363 312.667 8.5003 312.667 10.367ZM323.333 9.83363C323.333 10.2336 322.8 10.9003 322 11.3003C321.333 11.7003 320.667 11.4336 320.667 10.767C320.667 9.96697 321.333 9.3003 322 9.3003C322.8 9.3003 323.333 9.56697 323.333 9.83363ZM356.667 39.567C359.333 42.9003 359.467 44.2336 358.667 54.6336C358.133 60.9003 357.2 66.5003 356.667 67.0336C356.133 67.7003 354.4 67.0336 352.8 65.4336C348.133 60.767 342 62.5003 342 68.6336C342 72.5003 344.533 74.6336 348.933 74.6336C351.6 74.6336 352.667 75.3003 352.667 77.0336C352.667 80.767 348.8 85.3003 345.6 85.3003C343.333 85.3003 342.533 86.1003 342.267 88.9003C341.867 93.7003 338.533 96.367 335.2 94.5003C332.133 92.9003 332.133 90.6336 334.667 82.1003C335.733 78.5003 336.267 74.1003 335.867 72.1003C334.667 66.9003 328.667 58.767 324.533 56.5003C316.667 52.5003 296.533 55.3003 286 61.967C274.667 69.167 262.267 89.3003 258.667 106.367C255.6 120.634 256.133 129.3 260.667 141.034C274.933 177.567 308.933 188.1 334.667 163.834C338.8 159.967 342.133 155.434 342.667 153.167C344 147.167 353.2 142.367 354.533 146.9C354.8 147.834 356.267 153.967 357.733 160.367C360.133 170.5 361.333 173.034 366 178.1C369.067 181.434 371.333 184.767 370.933 185.7C370.667 186.634 368.267 187.434 365.6 187.7C361.733 188.1 360 187.434 357.333 184.5L354 180.9V185.7C354 189.3 353.2 191.034 350.8 192.634C344.667 196.634 339.6 190.767 342.133 182.367C344 175.7 343.733 175.567 337.733 179.167C318.533 190.234 293.067 190.9 272 180.767C253.2 171.834 240.667 157.834 235.2 139.7C232.4 130.5 232.4 130.367 234.933 128.634C236.4 127.567 238.4 124.9 239.333 122.634C241.333 117.967 239.333 111.7 234.933 108.634C232.667 107.034 232.4 105.834 233.2 100.5C234.533 90.2336 243.733 73.0336 252.4 64.1003C267.867 48.367 282 42.367 304 42.367C319.733 42.367 329.867 45.167 340.533 52.367C348.133 57.4336 350.933 57.4336 352.133 52.5003C353.2 48.367 351.733 46.367 348.4 47.3003C345.333 48.367 340.667 44.767 340.667 41.3003C340.667 37.8336 343.467 35.967 348.8 35.967C352.667 35.967 354.4 36.767 356.667 39.567ZM318.533 67.3003C322.133 69.7003 323.333 70.1003 323.333 68.6336C323.333 65.8336 326.533 66.1003 329.2 69.167C331.333 71.567 331.467 73.3003 330.4 85.967L329.2 100.1L332.667 102.234C337.467 105.434 333.733 105.967 327.733 102.9C321.6 99.7003 316.933 94.767 312 86.2336C310 82.6336 307.467 79.4336 306.533 79.0336C303.067 77.7003 304.667 75.7003 308.667 76.2336C313.467 76.9003 313.733 75.7003 309.333 72.767C305.2 69.967 303.733 70.1003 297.6 73.3003L292.533 75.967L294.667 72.1003C299.067 63.3003 309.6 61.3003 318.533 67.3003ZM351.333 68.6336C351.333 71.3003 350.667 71.967 348.133 71.967C346.267 71.967 344.4 71.3003 344 70.6336C342.4 68.1003 344.533 65.3003 348 65.3003C350.667 65.3003 351.333 65.967 351.333 68.6336ZM378.533 78.6336C382.133 79.967 383.2 82.6336 380.133 82.6336C377.333 82.6336 365.067 93.167 361.2 99.0336C358.133 103.7 357.467 104.1 356.4 102.1C355.6 100.767 355.467 97.0336 356 93.567C356.667 88.6336 358.133 86.2336 362.133 82.367C367.733 77.0336 372 76.1003 378.533 78.6336ZM294.533 93.967C296.267 95.8336 300.667 107.7 300.667 110.767C300.667 112.767 295.333 113.434 292.4 111.834C289.6 110.367 289.467 110.367 291.067 112.367C294.133 115.967 291.6 117.7 284.533 116.9C276.8 115.967 273.333 114.234 270.533 109.967C267.6 105.567 269.333 103.567 275.333 104.234C280.267 104.634 280.4 104.634 279.733 101.034C279.067 97.567 279.6 96.9003 283.333 97.0336C283.733 97.0336 285.333 97.4336 287.067 97.967C289.6 98.6336 290 98.367 290 95.4336C290 91.4336 291.6 91.0336 294.533 93.967ZM374.8 102.634C378.667 104.234 378.8 105.967 375.2 114.767C373.733 118.634 372.667 123.567 372.933 125.834C373.333 129.3 374.133 130.1 378.267 131.3C385.2 133.167 386.133 134.634 386.933 144.234C387.467 150.767 387.2 153.034 385.6 154.367C383.867 155.834 383.6 155.434 384.267 150.9C384.8 146.634 384.4 145.3 382.133 143.7C379.6 141.967 379.467 141.434 381.333 139.967C384 137.7 382.8 136.234 378.8 136.9C376.667 137.3 374.267 136.367 371.2 133.567C366.933 129.834 366.667 128.9 366 119.034C365.333 109.034 365.2 108.634 362 108.367C360.133 108.367 358.133 108.234 357.6 108.1C356.933 107.967 359.333 104.234 362.933 99.7003L369.2 91.4336L370.4 96.5003C371.333 99.967 372.667 101.834 374.8 102.634ZM348.4 99.7003C349.067 103.834 346.4 106.634 342.133 106.634C338.8 106.5 338.8 106.5 343.067 104.634C347.867 102.5 348.933 98.6336 344.533 98.6336C343.067 98.6336 342.267 98.1003 342.667 97.167C344.133 94.9003 348 96.5003 348.4 99.7003ZM311.6 102.234C313.867 104.234 314 104.234 314 102.234C314 99.0336 318.933 99.4336 320 102.5C320.4 103.967 320.4 106.634 319.867 108.634C319.067 112.1 319.067 112.234 323.333 111.3C329.467 109.967 328.133 113.167 320.933 116.634C314.667 119.7 313.867 121.3 318.533 121.3C320.267 121.3 323.2 122.5 325.2 124.1C328.933 127.034 330 131.434 326.667 130.1C325.6 129.7 323.733 128.9 322.667 128.5C320.933 127.834 320.933 128.234 322.8 131.567C324.4 134.234 324.8 136.634 324.133 139.167C323.2 142.767 323.067 142.9 320.667 140.634C318.133 138.367 318 138.367 318 140.767C318 144.234 315.467 146.634 311.733 146.634C309.6 146.634 308 145.167 306.133 141.567L303.6 136.634V143.167C303.6 151.167 301.867 153.167 298.4 149.434C296 146.9 295.6 146.767 294 148.634C291.2 152.1 289.6 150.9 290.4 145.967C291.067 141.7 290.933 141.434 288.667 142.634C281.733 146.367 281.6 142.5 288.667 134.634C293.6 129.034 293.867 128.9 294 131.967C294.133 135.034 294.133 135.167 295.6 132.767C298.267 127.967 303.867 124.1 305.733 125.567C307.867 127.434 307.733 125.967 305.333 121.434C304.267 119.3 303.867 117.167 304.4 116.767C304.8 116.234 304.667 115.434 303.867 114.9C302 113.7 305.6 99.967 307.733 99.967C308.533 99.967 310.267 100.9 311.6 102.234ZM341.467 112.634C352.667 117.3 371.333 135.034 376.667 146.1C379.6 151.967 380.267 165.034 378 169.434C376.4 172.367 370.133 172.9 367.6 170.367C365.333 168.1 365.6 163.3 368 161.3C370 159.567 370.533 160.234 370.133 164.234C369.733 167.7 372.4 168.367 374 165.167C376 161.567 374.667 154.634 370.4 145.834C366.133 137.167 349.067 120.1 339.333 114.767C331.733 110.5 333.2 109.167 341.467 112.634ZM232.133 117.567C233.067 120.5 229.6 124.5 226.8 123.567C224 122.634 222.8 118.9 224.533 116.767C227.067 113.7 230.933 114.1 232.133 117.567ZM288.667 118.634L292 118.767L288.4 121.834L284.8 125.034L289.467 124.634C292 124.367 294 124.5 294 124.767C294 129.434 280.933 138.634 274.533 138.634C272.133 138.634 269.733 137.967 269.333 137.3C268.933 136.5 268.933 135.967 269.6 135.967C270.133 135.967 272.133 134.767 274 133.3L277.333 130.634L273.067 131.434C270.4 131.967 267.867 131.7 266.667 130.634C263.733 128.234 264.267 126.634 267.733 126.634C272.133 126.634 273.067 125.167 270 123.034C264.4 119.167 268 117.167 278.667 118.1C282.4 118.367 286.8 118.634 288.667 118.634ZM301.2 118.5C302.533 120.634 300.533 123.967 298 123.967C294.933 123.967 293.467 121.834 294.533 119.3C295.333 117.167 300.133 116.634 301.2 118.5ZM353.867 131.434C360.667 132.767 358.667 134.234 349.2 134.9C341.467 135.434 339.867 135.967 337.067 139.3C334.133 142.634 333.733 144.1 334.267 150.9L334.8 158.634L331.867 155.834L328.8 153.034L326.933 157.7C324.133 164.1 311.6 173.3 305.6 173.3C303.067 173.3 300.267 172.5 299.467 171.434C298.4 170.234 296.267 169.834 292.8 170.234C286.667 171.034 282 167.434 282 161.967C282 157.967 286.267 153.3 290 153.3C293.467 153.3 293.467 156.5 289.867 160.1C286.933 163.034 287.333 166.234 290.8 167.567C292.4 168.1 294.267 166.9 297.067 163.567C300.533 159.034 304.4 157.434 306.4 159.434C307.333 160.5 304.667 166.634 303.067 166.634C302.533 166.634 302 167.567 302 168.634C302 169.967 303.333 170.634 305.867 170.634C308.933 170.634 310.4 169.567 312.667 165.7C314.267 162.9 316.8 159.834 318.267 158.767C320.933 156.9 320.933 156.9 317.2 155.3L313.333 153.567L316.933 152.234C318.933 151.434 325.067 146.5 330.667 141.434C341.6 131.167 345.067 129.7 353.867 131.434ZM227.6 151.3C228.933 154.1 228.667 155.3 226.4 158.367C224.267 161.167 224 162.767 224.933 164.5C225.6 165.834 225.867 169.034 225.333 171.7C224.533 175.834 224.667 176.234 226.4 174.767C229.6 172.234 230.133 175.167 227.6 181.167C224.933 187.567 221.333 188.367 219.2 183.034C213.067 166.9 212.933 156.9 218.667 151.167C222.8 147.034 225.733 147.167 227.6 151.3ZM246.667 169.3C247.733 172.767 246 175.834 239.333 181.7C230.933 189.434 229.2 187.967 234.133 177.3C238.8 167.034 244.8 163.167 246.667 169.3ZM254.533 190.9C253.867 193.034 254.267 193.3 257.6 192.634C259.6 192.1 262.133 191.567 263.067 191.167C265.867 190.367 264.8 193.3 261.067 196.767C257.067 200.5 257.333 200.5 236.533 197.834C232.267 197.3 229.067 197.7 226.4 199.034C221.733 201.567 218 199.834 218 195.3C218 191.434 222.4 188.634 225.467 190.367C226.8 191.034 230.4 190.9 234.667 189.967C238.667 189.034 242.133 188.5 242.4 188.767C242.667 189.034 244.933 188.5 247.467 187.434C252.667 185.3 255.867 186.767 254.533 190.9Z" fill="white"/>
            <path d="M316.667 18.1002L294.667 19.7002L316.267 19.4335C334.8 19.3002 341.6 18.5002 339.2 16.9002C338.933 16.7669 328.8 17.3002 316.667 18.1002Z" fill="white"/>
            <path d="M282.667 22.6335C280.933 23.3002 280.8 23.8335 282 23.8335C283.067 23.8335 285.2 23.3002 286.667 22.6335C288.4 21.9668 288.533 21.4335 287.333 21.4335C286.267 21.4335 284.133 21.9668 282.667 22.6335Z" fill="white"/>
            <path d="M336.4 22.9003C337.2 23.7003 341.333 24.6336 345.6 24.9003L353.333 25.3003L345.333 23.4336C335.333 21.0336 334.4 20.9003 336.4 22.9003Z" fill="white"/>
            <path d="M262.933 29.5666C258.667 31.8333 252.533 36.1 249.333 38.9C242.933 44.6333 242 44.9 242 41.7C242 40.5 241.6 39.8333 241.2 40.3666C240.133 41.4333 238.133 50.6333 239.067 50.6333C239.467 50.6333 243.6 47.0333 248.133 42.6333C253.2 37.7 259.867 33.0333 265.2 30.5C270 28.2333 274 26.1 274 25.8333C274 24.3666 270 25.7 262.933 29.5666Z" fill="white"/>
            <path d="M228.533 61.1668L228 67.8335L232.4 63.5668C236.133 59.9668 236.533 59.1668 234.4 58.9002C233.067 58.6335 231.333 57.5668 230.533 56.5002C229.2 54.9002 228.8 55.8335 228.533 61.1668Z" fill="white"/>
            <path d="M307.333 111.3C306.267 112.5 306.267 113.3 307.067 113.3C308.667 113.3 310.533 110.767 309.6 109.834C309.333 109.567 308.267 110.1 307.333 111.3Z" fill="white"/>
            <path d="M281.733 122.234C282.667 122.634 283.867 122.5 284.267 122.1C284.8 121.7 284 121.3 282.533 121.434C281.067 121.434 280.667 121.834 281.733 122.234Z" fill="white"/>
            <path d="M0.679012 0.966102C0.279012 1.7661 0.545678 44.1661 1.34568 95.3661C2.01235 146.566 2.67901 194.166 2.67901 201.099C2.81235 210.566 3.07901 213.233 4.14568 211.366C5.07901 209.633 5.21235 178.433 4.27901 108.033C3.61235 52.5661 3.34568 6.03277 3.74568 4.83277C4.27901 2.5661 9.47901 2.43277 92.5457 2.43277C140.946 2.43277 184.679 2.03277 189.746 1.49944L198.679 0.699435V106.033V211.366L166.412 212.166C148.679 212.699 112.012 213.233 84.8123 213.233C57.6123 213.366 31.2123 213.899 26.0123 214.433C13.079 215.766 77.7457 216.033 146.412 214.833L201.346 214.033L201.079 107.233L200.679 0.432769L101.079 0.0327687C39.2123 -0.100565 1.21235 0.166102 0.679012 0.966102Z" fill="white"/>
            <path d="M29.4791 6.03261L6.27905 6.43261L7.21239 104.166C7.74572 157.766 8.41239 203.766 8.94572 206.033L9.61239 210.433H58.5457C85.4791 210.433 127.479 210.033 151.746 209.499L196.012 208.699V131.899C196.012 89.6326 195.612 43.8993 195.079 30.0326L194.279 5.09927L123.479 5.36594C84.5457 5.49927 42.2791 5.89927 29.4791 6.03261ZM116.412 13.2326C118.012 14.1659 121.879 17.2326 125.079 20.0326C130.679 25.2326 133.879 26.0326 134.146 22.2993C134.412 16.4326 136.546 11.6326 138.546 12.0326C141.079 12.5659 144.012 18.1659 143.079 20.5659C142.279 22.8326 132.679 27.7659 128.946 27.7659C127.346 27.7659 123.079 25.6326 119.479 23.0993C115.079 20.0326 111.346 18.4326 108.412 18.4326C103.479 18.4326 102.812 19.6326 106.679 22.0326C108.946 23.4993 114.279 31.7659 112.946 31.7659C112.679 31.7659 110.412 30.8326 108.146 29.6326C103.879 27.4993 101.212 27.4993 90.6791 30.1659C87.4791 30.9659 83.7457 30.8326 79.3457 29.6326C75.6124 28.5659 71.2124 27.3659 69.3457 26.9659L66.0124 26.0326L68.6791 29.0993L71.3457 32.2993L66.2791 29.2326C62.1457 26.6993 59.6124 26.1659 51.6124 26.4326C37.7457 26.9659 35.7457 26.5659 42.0124 24.4326C45.6124 23.2326 46.4124 22.6993 44.4124 22.5659C42.8124 22.4326 39.8791 23.0993 37.8791 23.7659C33.0791 25.6326 30.4124 23.3659 33.6124 20.1659C35.0791 18.6993 39.0791 17.8993 45.7457 17.3659C54.2791 16.8326 57.7457 17.3659 70.0124 21.0993C85.8791 25.8993 86.6791 25.7659 96.1457 18.2993C104.279 11.8993 110.679 10.2993 116.412 13.2326ZM29.3457 14.4326C29.3457 15.0993 28.6791 17.2326 27.7457 18.9659C25.7457 23.6326 29.0791 27.3659 36.9457 29.3659C43.8791 31.0993 43.4791 32.2993 36.0124 32.0326C22.9457 31.4993 16.2791 22.4326 23.4791 15.0993C25.7457 12.8326 29.3457 12.4326 29.3457 14.4326ZM181.879 19.8993C184.946 23.4993 186.812 31.7659 184.546 31.7659C184.146 31.7659 181.746 29.6326 179.346 26.9659C175.746 23.2326 174.146 22.4326 171.746 23.0993C167.079 24.5659 165.346 26.8326 163.479 33.8993C162.012 39.6326 161.612 40.0326 160.812 37.3659C158.546 30.4326 163.346 19.6326 169.879 17.0993C175.079 14.9659 178.412 15.7659 181.879 19.8993ZM61.4791 35.2326C63.6124 37.2326 63.7457 37.6326 61.8791 40.4326C60.6791 42.1659 60.0124 45.2326 60.2791 47.3659C60.5457 50.2993 61.4791 51.2326 64.2791 51.4993C68.4124 52.0326 72.0124 47.7659 72.0124 42.2993C72.0124 39.0993 74.0124 37.0993 77.2124 37.0993C77.7457 37.0993 79.2124 39.2326 80.4124 41.7659L82.5457 46.2993L92.2791 41.7659C100.946 37.4993 103.079 37.0993 113.479 37.0993C134.279 37.0993 150.146 44.2993 160.012 58.1659C165.879 66.1659 166.946 71.7659 162.946 71.7659C159.212 71.7659 155.746 76.2993 156.279 80.6993C156.546 83.3659 157.879 84.9659 160.946 86.4326C167.079 89.2326 166.812 93.7659 160.012 102.299C152.812 111.499 146.012 115.633 135.746 117.366C126.812 118.833 123.479 118.033 114.279 112.166C110.546 109.766 110.412 109.766 107.346 113.766C103.346 118.566 101.612 128.166 104.146 131.233C105.079 132.299 107.479 134.166 109.479 135.233C113.079 137.099 113.346 136.966 115.346 133.099C117.612 128.699 121.079 126.433 125.612 126.433C132.812 126.433 134.412 135.099 128.412 141.366C124.279 145.766 121.879 146.166 120.679 142.433C119.746 139.499 122.012 134.433 124.279 134.433C125.079 134.433 125.346 134.033 124.812 133.366C124.279 132.833 122.412 134.033 120.946 136.033C118.279 139.233 117.479 139.499 112.946 138.566C105.612 136.833 101.346 133.499 100.412 128.833C99.6124 125.099 99.4791 124.966 97.8791 127.099C94.8124 131.366 87.7457 154.433 88.5457 157.633C88.9457 159.233 90.6791 161.366 92.2791 162.166C95.3457 163.633 95.3457 163.633 91.7457 163.633C85.7457 163.766 84.6791 160.566 84.8124 143.366C84.9457 134.966 85.4791 127.366 86.0124 126.566C87.2124 124.433 90.8124 124.833 92.5457 127.233C94.1457 129.366 94.8124 128.433 104.946 112.033C107.746 107.499 119.346 102.433 126.946 102.433C136.412 102.433 135.746 104.566 125.879 105.499C113.612 106.699 111.879 108.033 118.546 111.099C123.479 113.233 124.412 113.233 128.946 111.633C132.279 110.299 135.346 107.633 138.012 103.766C141.479 98.5659 142.012 96.2993 142.412 87.0993C142.679 81.0993 142.279 73.7659 141.346 70.5659C139.346 63.2326 132.279 55.3659 124.279 52.0326C108.412 45.3659 96.9457 47.3659 84.0124 59.2326L76.0124 66.6993V111.099V155.499L80.4124 161.899C83.7457 167.099 86.6791 169.366 94.2791 173.233C110.546 181.366 123.346 180.966 136.279 172.033C141.612 168.166 144.412 164.966 147.746 158.433C151.746 150.833 152.146 148.833 151.746 141.633C151.346 134.833 150.412 132.033 146.412 126.033L141.612 118.833L145.746 116.699C148.146 115.499 151.612 113.499 153.612 112.166L157.346 109.899L163.346 115.766C171.746 124.033 176.279 134.433 171.346 134.433C168.146 134.433 164.012 139.499 164.012 143.499C164.012 147.499 168.279 152.433 172.412 153.366C176.412 154.033 164.946 171.099 154.946 178.966C150.412 182.566 146.946 185.766 147.212 186.166C148.146 186.966 156.546 182.299 160.412 178.699C164.679 174.699 165.079 175.766 161.346 181.099C158.146 185.633 150.146 189.633 146.012 188.566C144.412 188.166 140.146 188.699 136.546 189.766C127.346 192.566 121.746 192.299 106.412 188.299C91.6124 184.566 88.4124 184.966 82.6791 191.099C79.8791 194.033 79.3457 194.166 75.8791 192.433C72.5457 190.566 72.2791 190.166 73.7457 186.433C75.8791 180.833 73.7457 177.899 67.4791 177.366C63.3457 176.966 62.5457 177.366 61.3457 180.299C60.6791 182.166 60.4124 184.699 60.9457 185.766C61.3457 186.966 60.4124 189.233 58.6791 191.099C55.6124 194.299 55.6124 194.299 52.4124 191.766C49.2124 189.233 49.0791 189.233 43.8791 192.033C36.6791 195.766 28.5457 194.699 24.1457 189.633C19.8791 184.566 20.9457 177.499 27.2124 169.766C29.8791 166.566 33.2124 161.366 34.6791 158.166C36.8124 153.366 36.9457 152.033 35.4791 149.899C32.8124 145.633 29.6124 144.299 27.0791 145.899C23.6124 148.033 23.6124 149.899 26.9457 153.099C30.0124 155.899 30.0124 156.033 27.3457 157.899C24.1457 160.299 22.8124 159.899 19.6124 155.366L16.9457 151.899L20.5457 147.233C26.9457 138.833 40.6791 139.899 44.5457 149.233C46.8124 154.833 46.1457 157.233 39.7457 164.433C34.5457 170.299 35.2124 172.433 41.0791 168.299C43.3457 166.833 44.0124 166.699 44.0124 168.033C43.8791 170.566 40.1457 174.833 34.6791 178.433C32.1457 180.166 29.7457 181.766 29.4791 182.033C28.1457 183.099 34.0124 187.766 36.8124 187.766C41.4791 187.766 47.4791 181.766 50.0124 174.699C55.0791 160.299 55.8791 84.0326 51.0791 68.0326C48.1457 58.4326 41.3457 47.2326 38.0124 46.6993C33.3457 46.0326 30.2791 49.4993 30.1457 55.7659C30.0124 61.0993 30.4124 61.7659 36.0124 65.7659C40.1457 68.6993 42.1457 71.0993 42.4124 73.4993C42.8124 76.6993 42.4124 77.0993 38.8124 77.0993C33.7457 77.0993 33.4791 79.0993 38.4124 80.4326C43.4791 81.6326 48.0124 86.2993 48.0124 90.1659C48.0124 92.9659 47.6124 93.2326 44.0124 92.4326C41.8791 91.8993 40.0124 91.7659 40.0124 92.0326C40.0124 92.2993 41.2124 94.8326 42.5457 97.6326C44.0124 100.433 44.8124 103.499 44.4124 104.566C43.6124 106.699 40.5457 107.099 39.3457 105.099C37.6124 102.166 36.0124 104.033 36.0124 108.966C36.0124 115.366 32.5457 118.433 25.2124 118.433C18.5457 118.433 13.3457 114.166 13.3457 108.566C13.3457 103.633 15.3457 101.099 19.4791 101.099C25.7457 101.099 26.9457 108.033 21.0791 110.299C18.4124 111.366 18.2791 111.633 20.4124 112.433C26.1457 114.833 30.6791 107.366 30.9457 95.0993C31.0791 88.9659 30.4124 86.6993 26.4124 80.1659C18.8124 67.7659 17.3457 64.1659 17.3457 58.5659C17.3457 51.4993 19.3457 46.6993 24.2791 41.4993C29.3457 36.2993 35.2124 34.9659 43.4791 36.9659C48.9457 38.2993 50.0124 38.2993 53.7457 35.8993C58.9457 32.5659 58.5457 32.5659 61.4791 35.2326ZM155.346 37.4993C167.079 44.1659 174.679 59.7659 175.746 79.2326C176.146 88.9659 175.879 92.4326 174.012 96.2993C171.346 102.033 168.679 102.833 170.012 97.3659C173.612 83.2326 172.946 70.5659 168.012 60.4326C164.546 53.3659 153.746 43.2326 147.346 41.0993C142.146 39.3659 141.479 37.8993 145.079 35.8993C148.279 33.8993 149.346 34.1659 155.346 37.4993ZM116.012 59.4993C116.012 60.0326 114.679 61.0993 113.079 61.7659C111.346 62.5659 109.479 64.6993 108.812 66.6993C107.746 69.6326 108.146 71.2326 111.079 75.6326C114.812 81.2326 117.346 82.6993 117.346 79.2326C117.346 76.4326 122.679 73.0993 127.079 73.0993C130.946 73.0993 137.346 76.5659 137.346 78.6993C137.346 79.3659 135.079 79.7659 132.412 79.6326C122.679 78.9659 116.812 85.0993 117.612 94.9659C118.012 100.166 117.612 101.099 114.946 102.433C110.146 104.566 108.812 104.033 106.012 98.6993C103.879 94.8326 102.412 93.6326 99.2124 93.3659C94.5457 92.9659 90.6791 95.7659 90.6791 99.8993C90.6791 104.033 88.4124 102.833 87.4791 98.2993C86.9457 95.3659 87.4791 92.6993 89.0791 89.8993C91.3457 86.1659 92.1457 85.7659 97.7457 86.0326C104.546 86.1659 105.479 84.8326 102.012 80.2993C100.946 78.9659 100.012 75.2326 100.012 72.1659C100.012 65.2326 106.012 58.4326 112.146 58.4326C114.279 58.4326 116.012 58.8326 116.012 59.4993ZM186.812 66.1659C186.012 67.6326 185.346 73.3659 185.346 78.6993C185.346 87.0993 184.812 89.2326 182.012 93.0993C179.879 96.0326 178.679 96.8326 178.679 95.3659C178.679 94.1659 179.479 92.6993 180.412 92.1659C181.612 91.3659 181.879 88.5659 181.346 82.4326L180.812 73.7659L179.879 81.7659C179.079 89.7659 179.079 89.7659 178.946 78.6993C178.679 68.4326 178.946 67.3659 182.146 64.1659C186.146 60.1659 189.346 61.6326 186.812 66.1659ZM175.212 106.833C176.279 108.566 176.146 109.499 174.679 110.433C172.146 112.033 170.546 111.633 168.812 108.699C167.746 106.966 167.879 106.033 169.346 105.099C171.879 103.499 173.479 103.899 175.212 106.833ZM108.012 105.766C108.012 106.033 105.479 107.499 102.279 108.833C99.0791 110.299 93.8791 113.233 90.6791 115.633C87.0791 118.166 83.4791 119.766 80.8124 119.633C76.9457 119.633 77.0791 119.499 83.4791 116.566C87.2124 114.833 90.8124 112.699 91.3457 111.766C93.3457 108.699 108.012 103.233 108.012 105.766ZM173.212 115.766C177.079 117.766 180.146 123.366 182.012 132.166C183.612 139.233 183.879 139.766 183.879 135.499C184.012 132.699 182.812 127.366 181.212 123.633C179.212 118.566 179.079 117.099 180.546 118.299C186.812 123.499 188.546 139.766 184.546 156.699C182.546 165.233 182.546 170.433 184.679 178.699C185.612 182.033 185.346 182.433 182.279 182.433C178.679 182.433 176.546 179.899 174.679 173.233L173.746 169.766L172.012 173.766C167.746 184.566 169.079 190.433 176.146 190.433C178.146 190.433 180.279 190.966 180.679 191.766C182.146 194.166 178.812 198.166 173.879 199.766C167.879 201.766 162.012 199.633 159.346 194.299C157.079 190.166 156.679 187.366 158.679 190.433C159.746 192.033 160.012 191.766 160.146 189.099C160.279 185.766 160.279 185.899 162.012 189.766C163.479 192.966 163.879 193.233 164.012 191.099L164.146 188.433L165.612 191.099C167.479 194.433 169.346 195.766 172.012 195.633C173.212 195.633 172.812 194.966 170.946 194.166C169.212 193.233 167.346 190.566 166.546 187.633C164.812 182.166 165.346 180.299 174.012 159.233C178.679 148.166 178.946 146.566 178.279 137.633C177.612 128.033 175.346 121.766 171.479 118.566C167.612 115.366 168.946 113.366 173.212 115.766ZM47.3457 122.699L52.2791 125.499L45.2124 130.033C36.6791 135.366 32.9457 135.499 24.8124 130.966C18.9457 127.633 18.4124 127.633 15.3457 129.633C11.7457 132.033 11.6124 131.899 12.8124 128.433C14.4124 124.299 20.1457 122.566 26.9457 124.033C32.4124 125.366 33.4791 125.233 36.6791 122.566C41.2124 119.099 41.3457 119.099 47.3457 122.699ZM147.746 142.166C147.479 143.766 145.479 144.299 138.412 144.299C127.879 144.433 126.546 142.966 135.746 141.633C139.212 141.233 142.946 140.299 144.012 139.766C146.546 138.299 148.279 139.499 147.746 142.166ZM111.212 140.966C111.612 141.499 113.479 141.766 115.479 141.366C118.146 140.833 118.812 141.233 118.412 142.566C118.012 143.633 116.546 144.433 114.946 144.433C111.879 144.566 105.346 150.033 105.479 152.299C105.479 153.099 106.412 152.433 107.612 150.699C109.746 147.633 114.679 146.566 114.679 149.366C114.679 150.299 115.479 150.166 117.079 148.833C120.279 145.899 128.012 146.833 130.946 150.433C135.479 156.033 133.079 162.833 125.879 164.566C121.879 165.633 118.946 163.233 116.412 157.366C114.279 152.433 113.079 151.899 113.479 156.033C113.612 157.766 113.612 162.299 113.612 166.033C113.346 172.033 112.946 173.099 110.812 173.099C106.679 173.099 106.279 170.833 109.212 165.899C113.079 159.766 112.812 157.366 108.679 158.166C104.679 158.833 100.012 155.233 100.012 151.499C100.012 148.166 103.479 141.499 105.612 140.699C108.412 139.633 110.412 139.633 111.212 140.966Z" fill="white"/>
            <path d="M38.8124 19.8993C31.479 22.0326 35.079 22.566 42.8124 20.566C46.8124 19.4993 48.5457 18.566 46.679 18.6993C44.8124 18.6993 41.3457 19.2326 38.8124 19.8993Z" fill="white"/>
            <path d="M113.746 92.4327C113.746 95.366 114.012 96.4327 114.279 94.6993C114.546 93.0993 114.546 90.6993 114.279 89.366C113.879 88.166 113.612 89.4993 113.746 92.4327Z" fill="white"/>
            <path d="M109.346 94.9659C109.346 96.0326 109.879 97.2326 110.546 97.6326C111.212 98.1659 111.479 97.2326 111.079 95.7659C110.279 92.6992 109.346 92.2992 109.346 94.9659Z" fill="white"/>
            <path d="M182.946 83.0992C182.946 85.2326 183.212 86.0326 183.612 84.6992C183.879 83.4992 183.879 81.6326 183.612 80.6992C183.212 79.8992 182.946 80.8326 182.946 83.0992Z" fill="white"/>
            <path d="M119.479 149.5C119.879 150.833 120.679 151.5 121.079 151.1C121.479 150.7 121.079 149.633 120.146 148.7C118.812 147.5 118.679 147.633 119.479 149.5Z" fill="white"/>
        </svg>
    )
}

export default Logo