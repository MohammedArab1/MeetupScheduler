import { Button } from "@mui/material"
import { useQuery} from "react-query"
import { fetchGroupById } from "../../Utils/Queries"
import { useNavigate, useParams } from "react-router-dom"
import { isUserLeader } from "../../Utils/Utils"
import { useAuth } from "../../customHooks/useAuth"
import { useMutations } from "../../customHooks/useMutations"
import { useState } from "react"

const GroupDetails = () => {
  const {deleteGroupMutation,invalid, leaveGroupMutation} = useMutations()
  const {user} = useAuth()
  const {groupId} = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  
  const handleLeaveGroup = (userToBeDeletedId) => {
    const newGroup = {...group, members: group.members.filter(member => member._id !== userToBeDeletedId)}
    if (group.leader._id===userToBeDeletedId) {
      const newLeader = newGroup.members[Math.floor(Math.random() * newGroup.members.length)];
      newGroup.leader = newLeader
    }
    leaveGroupMutation.mutate({groupId:newGroup._id,newGroup})
  }
  
  const {isLoading,error,data} = useQuery('group',() => fetchGroupById(groupId),{
    onSuccess: (data) => {
      if (data.group===null) {
        return navigate('/UserHome')
      }
      const members = data.group.members
      const userExists = members.some(member => member._id === user.id)
      if (!userExists) {
        return navigate('/UserHome')
      }
      setGroup(data.group)
    },
    onError: (error) => {
      navigate('/UserHome')
    },
    retry: false,
    refetchOnReconnect: 'Always'
  })

  if (error) return <p>error</p>
  if (isLoading) return <p>loading</p>
  if (data.group===null) return <p>group does not exist</p>
  return (
    <div>
      {invalid.isInvalid && <p>{invalid.message}</p>}
      <p>Group name: {data.group.groupName}</p>
      {data.group.description && <p>Group description: {data.group.description}</p>}
      <p>Access Code: {data.group.accessCode}</p>
      <p>group id: {data.group._id}</p>
      <h2>MEMBERS:</h2>
      {data.group.members.map((member,i) => {
        return (
          <div key={i}>
            <h3>member {i+1}</h3>
            <p>Member name: {member.firstName} {member.lastName}</p>
            <p>Member email: {member.email}</p>
            <p>Member id: {member._id}</p>
            {/* {isUserLeader(data.group.leader._id) && <Button variant="text" type="button" onClick={() => leaveGroupMutation.mutate({groupId, userId:member._id})}>Kick user from group</Button>} */}
            {isUserLeader(data.group.leader._id) && <Button variant="text" type="button" onClick={() => handleLeaveGroup(member._id)}>Kick user from group</Button>}

          </div>
        )
      })}
      { isUserLeader(data.group.leader._id) && <Button variant="text" type="submit">Create meetup</Button>}
      { isUserLeader(data.group.leader._id) && <Button variant="text" type="button" onClick={() => deleteGroupMutation.mutate(groupId)}>Delete group</Button>}
      <button onClick={() => navigate(-1)}>go back</button>
    </div>
  )
  }

export default GroupDetails