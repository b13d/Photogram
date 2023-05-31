"use client"

export default function ErrorWrapper({error}: {error: Error}) {
  return <h1>Ooops!!! About{error.message}</h1>
}