
export default function useChangePost () {
  // 更新貼文的讚(同步更新DOM)
  function changeLikes (posts, newData) {
    posts.find(post => {
      if (post._id == newData.postId) {
        post.likes = newData.newLikes
      }
    })
  }

  // 更新貼文的留言(同步更新DOM)
  function changeComments (posts, newData) {
    posts.find(post => {
      if (post._id == newData.postId) {
        post.comments = newData.comments
      }
    })
  }

  // 從留言更新貼文的讚(同步更新DOM)
  function changeCommentLikes (comments, newData) {
    comments.find(comment => {
      let post = comment.post
      if (!post) return

      if (post._id == newData.postId) {
        post.likes = newData.newLikes
      }
    })
  }

  return {
    changeLikes,
    changeComments,
    changeCommentLikes
  }
}