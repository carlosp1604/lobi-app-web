export interface RefreshResponseDto {
  accessToken: string
  refreshToken: string
  sessionId: string
  accessTokenExpiresAt: string
  refreshTokenExpiresAt: string
  userData: {
    id: string
    name: string
    username: string
    imageUrl: string | null
  }
}
