import { FC, useEffect, useState } from 'react'
import {
  AvatarGroup,
  Box,
  Divider,
  IconButton,
  Modal,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { BorderBox } from '../../ui/ThemeBox'
import {
  FavoriteBorder,
  Favorite,
  Visibility,
  TaskAlt,
  Clear,
  ChatBubbleOutline,
} from '@mui/icons-material'
import { AddPost } from './AddPost'
import { Link } from 'react-router-dom'
import { useAuth } from '../../providers/useAuth'
import { IComment, IPost, IUser } from '../../../types'
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  runTransaction,
  setDoc,
  increment,
  getDocs,
  DocumentData,
} from 'firebase/firestore'
import moment from 'moment'
import { AddComment } from './AddComment'
import { PostSettings } from './PostSettings'
import { TransitionGroup } from 'react-transition-group'
import Collapse from '@mui/material/Collapse'
import { ThemeAvatar } from '../../ui/ThemeAvatar'
import { EditPost } from './EditPost'
import { DeletePost } from './DeletePost'
import { ThemeTooltip } from '../../ui/ThemeTooltip'
import { ThemeLikeIconButton } from '../../ui/ThemeIconButton'
import { useTranslation } from 'react-i18next'
import { ThemeOnlineBadge } from '../../ui/ThemeOnlineBadge'
import { useAppDispatch, useAppSelector } from '../../../hooks/redux'
import { EditComment } from './EditComment'
import { postsSlice } from '../../../store/reducers/PostsSlice'
import { PostsOrderBy } from './PostsOrderBy'

export const News: FC = () => {
  const { t } = useTranslation(['news'])
  document.title = t('title1')

  const { db, usersRdb } = useAuth()

  const [editingId, setEditingId] = useState('')
  const [deletedPosts, setDeletedPosts] = useState<IPost[]>([])

  const { posts } = useAppSelector((state) => state.posts)
  const { users } = useAppSelector((state) => state.users)
  const { emoji, uid, displayName, photoURL } = useAppSelector(
    (state) => state.user
  )
  const { setPosts } = postsSlice.actions
  const dispatch = useAppDispatch()

  const [openModal, setOpenModal] = useState(false)
  const [modalData, setModalData] = useState<IUser[]>([])

  const [openImage, setOpenImage] = useState(false)
  const [modalImage, setModalImage] = useState<string>('')

  const [isVisible, setIsVisible] = useState<string>('')

  const theme = useTheme()

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))

    const incViews = async () => {
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(async (d) => {
        const docRef = doc(db, 'posts', d.id)
        await setDoc(docRef, { views: increment(1) }, { merge: true })
      })
    }

    const setPostsFunc = onSnapshot(q, (querySnapshot) => {
      const postsArr: IPost[] = []
      querySnapshot.forEach(async (d: DocumentData) => {
        postsArr.push(d.data())
      })

      dispatch(setPosts(postsArr))
    })

    return () => {
      incViews()
      setPostsFunc()
    }
    // eslint-disable-next-line
  }, [db])

  const handleOpenModal = (post: IPost) => {
    setOpenModal(true)
    setModalData(post.likes)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setModalData([])
  }

  const handleOpenModalComments = (comment: IComment | undefined) => {
    if (!comment) return
    setOpenModal(true)
    setModalData(comment.likes)
  }

  const handleOpenImage = (image: string) => {
    setOpenImage(true)
    setModalImage(image)
  }

  const handleCloseImage = () => {
    setOpenImage(false)
    setModalImage('')
  }

  const handleLike = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newLikesArr = [
          ...new Map(
            [...sfDoc.data().likes, { displayName, photoURL, uid, emoji }].map(
              (like) => [like['uid'], like]
            )
          ).values(),
        ]

        transaction.update(docRef, {
          likes: newLikesArr,
        })
      })
    } catch (e) {
      console.log('Like failed: ', e)
    }
  }

  const handleDislike = async (post: IPost) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newLikesArr = sfDoc
          .data()
          .likes.filter((user: IUser) => user.uid !== uid)

        transaction.update(docRef, {
          likes: newLikesArr,
        })
      })
    } catch (e) {
      console.log('Dislike failed: ', e)
    }
  }

  const handleLikeComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const comment = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)

        const newLikesArr = [
          ...new Map(
            [
              ...sfDoc
                .data()
                .comments.find((comment: IComment) => comment.id === id).likes,
              { displayName, photoURL, uid, emoji },
            ].map((like) => [like['uid'], like])
          ).values(),
        ]

        comment.likes = newLikesArr

        const newCommentsArr = [
          ...sfDoc
            .data()
            .comments.filter((comment: IComment) => comment.id !== id),
          comment,
        ].sort((a, b) => +a.createdAt - +b.createdAt)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Like comment failed: ', e)
    }
  }

  const handleDislikeComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const comment = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)

        const newLikesArr = sfDoc
          .data()
          .comments.find((comment: IComment) => comment.id === id)
          .likes.filter((user: IUser) => user.uid !== uid)

        comment.likes = newLikesArr

        const newCommentsArr = [
          ...sfDoc
            .data()
            .comments.filter((comment: IComment) => comment.id !== id),
          comment,
        ].sort((a, b) => +a.createdAt - +b.createdAt)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Dislike comment failed: ', e)
    }
  }

  const handleDeleteComment = async (post: IPost, id: string) => {
    const docRef = doc(db, 'posts', post.id)

    try {
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(docRef)

        if (!sfDoc.exists()) {
          throw new Error('Document does not exist!')
        }

        const newCommentsArr = sfDoc
          .data()
          .comments.filter((comment: IPost) => comment.id !== id)

        transaction.update(docRef, {
          comments: newCommentsArr,
        })
      })
    } catch (e) {
      console.log('Comment Delete failed: ', e)
    }
  }

  const handleShow = (comment: IComment) => {
    setIsVisible(comment.id)
  }

  const handleHide = () => setIsVisible('')

  return (
    <>
      <AddPost />
      <PostsOrderBy />
      {users.length > 0 ? (
        <TransitionGroup>
          {posts.map((post) => (
            <Collapse key={post.id}>
              <BorderBox
                sx={{
                  p: 3,
                  mb: 2,
                  borderColor:
                    post.id === 'neTIz7g7S06Kgo8oZzY2'
                      ? '#b59261'
                      : theme.palette.divider,
                }}
              >
                {!deletedPosts.some((x) => x.id === post.id) && (
                  <Stack direction="row" justifyContent="space-between">
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Link to={`/profile/${post.author.uid}`}>
                        <ThemeOnlineBadge
                          overlap="circular"
                          variant={
                            usersRdb[post.author.uid]?.isOnline
                              ? 'dot'
                              : undefined
                          }
                        >
                          <ThemeAvatar
                            alt={post.author.displayName}
                            src={
                              users.find((u) => u.uid === post.author.uid)
                                ?.photoURL
                            }
                            draggable={false}
                          >
                            {post.author.emoji}
                          </ThemeAvatar>
                        </ThemeOnlineBadge>
                      </Link>
                      <Stack>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={0.5}
                        >
                          <Link to={`/profile/${post.author.uid}`}>
                            <Typography
                              variant="h6"
                              sx={{ wordBreak: 'break-word' }}
                            >
                              <b>{post.author.displayName}</b>
                            </Typography>
                          </Link>
                          {post.author.uid ===
                            'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                              <Tooltip
                                title={t('title3', { ns: ['other'] })}
                                placement="top"
                              >
                                <TaskAlt
                                  color="info"
                                  sx={{
                                    width: '20px ',
                                    height: '20px',
                                  }}
                                />
                              </Tooltip>
                            )}
                        </Stack>
                        <Typography variant="body2" color="textSecondary">
                          {moment(post.createdAt).calendar()}
                        </Typography>
                      </Stack>
                    </Stack>
                    <PostSettings
                      post={post}
                      setEditingId={setEditingId}
                      setDeletedPosts={setDeletedPosts}
                    />
                  </Stack>
                )}
                {editingId !== post.id &&
                  !deletedPosts.some((x) => x.id === post.id) ? (
                  <>
                    {/* <Typography
                      variant="body1"
                      sx={{ ml: 1, wordBreak: 'break-word' }}
                    >
                      {post.content}
                    </Typography> */}
                    <Typography
                      variant="body1"
                      sx={{ ml: 1, wordBreak: 'break-word' }}
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {post?.images?.length === 3 || post?.images?.length > 4 ? (
                      <Stack
                        direction="row"
                        sx={{
                          mt: 2,
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                        justifyContent="center"
                      >
                        {post.images.map((image) => (
                          <Box
                            sx={{
                              width: '258px',
                              height: '258px',
                              cursor: 'pointer',
                            }}
                            key={image}
                          >
                            <img
                              src={image}
                              alt={image}
                              width="258px"
                              height="258px"
                              className="cover"
                              loading="lazy"
                              draggable={false}
                              onClick={() => handleOpenImage(image)}
                            />
                          </Box>
                        ))}
                      </Stack>
                    ) : post?.images?.length === 2 ||
                      post?.images?.length === 4 ? (
                      <Stack
                        direction="row"
                        sx={{
                          mt: 2,
                          flexWrap: 'wrap',
                          gap: 1,
                        }}
                        justifyContent="center"
                      >
                        {post.images.map((image) => (
                          <Box
                            sx={{
                              width: '390px',
                              height: '390px',
                              cursor: 'pointer',
                            }}
                            key={image}
                          >
                            <img
                              src={image}
                              alt={image}
                              width="390px"
                              height="390px"
                              className="cover"
                              loading="lazy"
                              draggable={false}
                              onClick={() => handleOpenImage(image)}
                            />
                          </Box>
                        ))}
                      </Stack>
                    ) : post?.images?.length === 1 ? (
                      <Box
                        sx={{
                          mt: 2,
                          cursor: 'pointer',
                        }}
                        display="flex"
                      >
                        <img
                          src={post?.images[0]}
                          alt={post?.images[0]}
                          width="100%"
                          // height="500px"
                          className="image"
                          loading="lazy"
                          draggable={false}
                          onClick={() => handleOpenImage(post?.images[0])}
                        />
                      </Box>
                    ) : null}
                  </>
                ) : editingId === post.id &&
                  !deletedPosts.some((x) => x.id === post.id) ? (
                  <EditPost post={post} setEditingId={setEditingId} />
                ) : null}
                {deletedPosts.some((x) => x.id === post.id) && (
                  <DeletePost
                    post={post}
                    deletedPosts={deletedPosts}
                    setDeletedPosts={setDeletedPosts}
                  />
                )}
                {!deletedPosts.some((x) => x.id === post.id) && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ ml: -1, mb: -1 }}
                  >
                    <Stack
                      alignItems="center"
                      direction="row"
                      // spacing={0.2}
                      sx={{ mt: 2, zIndex: 1 }}
                    >
                      <Stack
                        alignItems="center"
                        direction="row"
                        sx={{ width: '55px' }}
                      >
                        <ThemeTooltip
                          title={
                            post.likes.length > 0 && (
                              <Stack alignItems="center">
                                <Typography
                                  textAlign="center"
                                  variant="body2"
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => handleOpenModal(post)}
                                >
                                  {t('line10')}
                                </Typography>
                                <AvatarGroup
                                  max={4}
                                  spacing={12}
                                  sx={{ cursor: 'pointer' }}
                                  onClick={() => handleOpenModal(post)}
                                >
                                  {post.likes.map((user) => (
                                    <Link
                                      to={`/profile/${user.uid}`}
                                      key={user.uid}
                                    >
                                      <ThemeAvatar
                                        alt={user.displayName}
                                        src={
                                          users.find((u) => u.uid === user.uid)
                                            ?.photoURL
                                        }
                                        title={user.displayName}
                                        sx={{
                                          width: '40px',
                                          height: '40px',
                                        }}
                                      >
                                        {user.emoji}
                                      </ThemeAvatar>
                                    </Link>
                                  ))}
                                </AvatarGroup>
                              </Stack>
                            )
                          }
                          placement="top"
                        >
                          {!post.likes.some((user) => user.uid === uid) ? (
                            <IconButton
                              onClick={() => handleLike(post)}
                              color="secondary"
                            >
                              <FavoriteBorder />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => handleDislike(post)}
                              color="error"
                            >
                              <Favorite />
                            </IconButton>
                          )}
                        </ThemeTooltip>
                        <Typography
                          variant="body1"
                          color="textSecondary"
                          sx={{ ml: -0.5 }}
                        >
                          <b>{post.likes.length > 0 && post.likes.length}</b>
                        </Typography>
                      </Stack>
                      <IconButton color="secondary">
                        <ChatBubbleOutline />
                      </IconButton>
                      <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ ml: -0.5 }}
                      >
                        <b>
                          {post.comments.length > 0 && post.comments.length}
                        </b>
                      </Typography>
                    </Stack>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                      sx={{ mt: 2, zIndex: 1 }}
                    >
                      <Visibility color="secondary" />
                      <Typography variant="body2" color="textSecondary">
                        {post.views < 1000
                          ? post.views
                          : Math.floor(post.views / 100) / 10 + 'K'}
                      </Typography>
                    </Stack>
                  </Stack>
                )}
                {post.comments.length > 0 && (
                  <TransitionGroup>
                    {post.comments.map((comment) => (
                      <Collapse
                        key={comment.id}
                        onMouseOver={() => handleShow(comment)}
                        onMouseOut={handleHide}
                      >
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={2}>
                            <Link to={`/profile/${comment.author.uid}`}>
                              <ThemeAvatar
                                alt={comment.author.displayName}
                                src={
                                  users.find(
                                    (u) => u.uid === comment.author.uid
                                  )?.photoURL
                                }
                                draggable={false}
                                sx={{ mt: 0.6 }}
                              >
                                {comment.author.emoji}
                              </ThemeAvatar>
                            </Link>
                            <Stack>
                              <Stack
                                alignItems="center"
                                direction="row"
                                spacing={0.5}
                              >
                                <Link to={`/profile/${comment.author.uid}`}>
                                  <Typography
                                    variant="h6"
                                    sx={{ wordBreak: 'break-word' }}
                                  >
                                    <b>{comment.author.displayName}</b>
                                  </Typography>
                                </Link>
                                {comment.author.uid ===
                                  'Y8kEZYAQAGa7VgaWhRBQZPKRmqw1' && (
                                    <Tooltip
                                      title={t('title3', { ns: ['other'] })}
                                      placement="top"
                                    >
                                      <TaskAlt
                                        color="info"
                                        sx={{
                                          width: '20px ',
                                          height: '20px',
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                              </Stack>
                              {editingId !== comment.id ? (
                                <Typography
                                  variant="body1"
                                  sx={{ mb: 1, wordBreak: 'break-word' }}
                                >
                                  {comment.content}
                                </Typography>
                              ) : (
                                <EditComment
                                  post={post}
                                  comment={comment}
                                  setEditingId={setEditingId}
                                />
                              )}
                              <Stack direction="row" spacing={1.5}>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {moment(comment.createdAt).calendar()}
                                </Typography>
                                {comment.author.uid === uid &&
                                  isVisible === comment.id &&
                                  Date.now() - +comment?.createdAt <
                                  86400000 && (
                                    <Typography
                                      variant="body2"
                                      color="textSecondary"
                                      onClick={() => setEditingId(comment.id)}
                                      sx={{ cursor: 'pointer' }}
                                    >
                                      {t('button4')}
                                    </Typography>
                                  )}
                              </Stack>
                            </Stack>
                          </Stack>
                          <Stack justifyContent="space-between">
                            {comment.author.uid === uid &&
                              isVisible === comment.id ? (
                              <IconButton
                                onClick={() =>
                                  handleDeleteComment(post, comment.id)
                                }
                                color="secondary"
                                sx={{
                                  height: '40px',
                                  width: '40px',
                                  mt: -1,
                                }}
                              >
                                <Clear sx={{ height: '20px', width: '20px' }} />
                              </IconButton>
                            ) : (
                              <Box sx={{ height: '40px', width: '40px' }}></Box>
                            )}

                            {(comment.likes.length > 0 ||
                              isVisible === comment.id) && (
                                <Stack
                                  alignItems="center"
                                  direction="row"
                                  sx={{ width: '55px', mr: -2 }}
                                >
                                  <ThemeTooltip
                                    title={
                                      comment.likes.length > 0 && (
                                        <Stack alignItems="center">
                                          <Typography
                                            textAlign="center"
                                            variant="body2"
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() =>
                                              handleOpenModalComments(
                                                post.comments.find(
                                                  (x: IComment) =>
                                                    x.id === comment.id
                                                )
                                              )
                                            }
                                          >
                                            {t('line10')}
                                          </Typography>
                                          <AvatarGroup
                                            max={4}
                                            spacing={12}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() =>
                                              handleOpenModalComments(
                                                post.comments.find(
                                                  (x: IComment) =>
                                                    x.id === comment.id
                                                )
                                              )
                                            }
                                          >
                                            {comment.likes.map((user) => (
                                              <Link
                                                to={`/profile/${user.uid}`}
                                                key={user.uid}
                                              >
                                                <ThemeAvatar
                                                  alt={user.displayName}
                                                  src={
                                                    users.find(
                                                      (u) => u.uid === user.uid
                                                    )?.photoURL
                                                  }
                                                  title={user.displayName}
                                                  sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                  }}
                                                >
                                                  {user.emoji}
                                                </ThemeAvatar>
                                              </Link>
                                            ))}
                                          </AvatarGroup>
                                        </Stack>
                                      )
                                    }
                                    placement="top"
                                  >
                                    {!comment.likes.some(
                                      (user) => user.uid === uid
                                    ) ? (
                                      <IconButton
                                        onClick={() =>
                                          handleLikeComment(post, comment.id)
                                        }
                                        color="secondary"
                                        sx={{
                                          height: '40px',
                                          width: '40px',
                                          mb: -1,
                                        }}
                                      >
                                        <FavoriteBorder
                                          sx={{ height: '20px', width: '20px' }}
                                        />
                                      </IconButton>
                                    ) : (
                                      <IconButton
                                        onClick={() =>
                                          handleDislikeComment(post, comment.id)
                                        }
                                        color="error"
                                        sx={{
                                          height: '40px',
                                          width: '40px',
                                          mb: -1,
                                        }}
                                      >
                                        <Favorite
                                          sx={{ height: '20px', width: '20px' }}
                                        />
                                      </IconButton>
                                    )}
                                  </ThemeTooltip>
                                  <Typography
                                    variant="body1"
                                    color="textSecondary"
                                    sx={{ ml: -0.5, mb: -1 }}
                                  >
                                    <b>
                                      {comment.likes.length > 0 &&
                                        comment.likes.length}
                                    </b>
                                  </Typography>
                                </Stack>
                              )}
                          </Stack>
                        </Stack>
                      </Collapse>
                    ))}
                  </TransitionGroup>
                )}
                <AddComment post={post} />
              </BorderBox>
            </Collapse>
          ))}
        </TransitionGroup>
      ) : (
        [...Array(3).keys()].map((post) => (
          <BorderBox key={post} sx={{ p: 3, mb: 2 }}>
            <Stack direction="row" justifyContent="space-between">
              <Stack
                alignItems="center"
                direction="row"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Skeleton
                  variant="circular"
                  sx={{ width: '55px', height: '55px', mb: 0.5 }}
                />
                <Stack>
                  <Stack alignItems="center" direction="row" spacing={0.5}>
                    <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
                      <Skeleton width={180} />
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="textSecondary">
                    <Skeleton width={120} />
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Typography variant="body1" sx={{ ml: 1, wordBreak: 'break-word' }}>
              <Skeleton />
            </Typography>
            <Typography variant="body1" sx={{ ml: 1, wordBreak: 'break-word' }}>
              <Skeleton />
            </Typography>
          </BorderBox>
        ))
      )}
      <Modal open={openModal} onClose={handleCloseModal} sx={{ zIndex: 1600 }}>
        <BorderBox
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            p: 3,
            transform: 'translate(-50%, -50%)',
            width: 500,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              {t('line10')}: {modalData.length > 0 && modalData.length}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              color="secondary"
              sx={{ width: '50px ', height: '50px', m: -2 }}
            >
              <Clear />
            </IconButton>
          </Stack>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2, mt: 2 }}>
            {modalData.map((user) => (
              <Box key={user.uid} sx={{ width: '100px' }}>
                <Link to={`/profile/${user.uid}`}>
                  <ThemeAvatar
                    alt={user.displayName}
                    src={users.find((u) => u.uid === user.uid)?.photoURL}
                    sx={{
                      width: '100px',
                      height: '100px',
                      mb: 1,
                    }}
                  >
                    <Typography variant="h3">{user.emoji}</Typography>
                  </ThemeAvatar>
                  <Box
                    sx={{
                      position: 'relative',
                      top: '-33px',
                      left: '74px',
                      height: '30px',
                      width: '30px',
                      mb: '-33px',
                      zIndex: 1,
                    }}
                  >
                    <ThemeLikeIconButton color="error">
                      <Favorite fontSize="small" />
                    </ThemeLikeIconButton>
                  </Box>
                  <Typography variant="body2" textAlign="center">
                    {user.displayName.replace(/ .*/, '').length < 14
                      ? user.displayName.replace(/ .*/, '')
                      : user.displayName.replace(/ .*/, '').slice(0, 13) + '…'}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Stack>
        </BorderBox>
      </Modal>
      <Modal
        open={openImage}
        onClose={handleCloseImage}
        sx={{ zIndex: 1600 }}
        BackdropProps={{
          style: { backgroundColor: 'rgba(0, 0, 0, 0.95)' },
        }}
      >
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            display="flex"
          >
            <img
              src={modalImage}
              alt={modalImage}
              height="100%"
              width="100%"
              className="contain"
              loading="lazy"
              draggable={false}
            />
          </Box>
          <IconButton
            onClick={handleCloseImage}
            color="secondary"
            sx={{
              position: 'absolute',
              height: '100px',
              width: '100px',
              top: 20,
              right: 20,
            }}
          >
            <Clear sx={{ height: '60px', width: '60px' }} />
          </IconButton>
        </>
      </Modal>
    </>
  )
}
